import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { Expense, Payment } from './entities';
import { CreateExpenseDto, OptionList, UpdateExpenseDto } from './dto';
import { User } from 'src/auth/entities/user.entity';
import { CreditCardsService } from 'src/credit-cards/credit-cards.service';
import { CreditCard } from 'src/credit-cards/entities/credit-card.entity';
import { ExpenseTypes, PaymentStatus } from './enums';
import { calculateInstallmentAmount, getNextMonth } from './helpers';
import { PAGE_LIMIT, PAGE_OFFSET } from 'src/common/constants';
import { HandleHttpErrors } from 'src/common/error-handlers';
import { amountToStringCurrencyFormat } from './helpers/amountToStringCurrencyFormat';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name)
    private readonly expenseModel: Model<Expense>,

    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,

    @Inject(forwardRef(() => CreditCardsService))
    private readonly creditCardsService: CreditCardsService,
  ) {}

  async create({ creditCardId, ...expenseData }: CreateExpenseDto, user: User): Promise<Expense> {
    const creditCard = await this.getCreditCard(creditCardId, user);
    const newExpense = await this.expenseModel.create({ ...expenseData, creditCard: creditCard._id, isActive: true, isDone: false });
    let newPayments;
    // Create the payments
    newPayments = await this.createPaymentsFromNewPurchase(newExpense);

    newExpense.payments = newPayments.map((payment) => payment._id);
    await newExpense.save();

    return newExpense.populate('payments');
  }

  async findAll(user: User, options: OptionList) {
    const { limit = PAGE_LIMIT, offset = PAGE_OFFSET } = options;
    const filter = await this.getFilter(user, options);
    let query = this.expenseModel.find(filter);

    query = query.limit(limit).skip(offset);
    const expenseList = await query.exec();
    return expenseList;
  }

  async findOne(id: string): Promise<Expense> {
    return (await this.expenseModel.findById(id)).populate('payments');
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto, user: User): Promise<Expense> {
    const currentExpense = await this.findOne(id);
    let updatedExpense: Expense = await this.expenseModel.findByIdAndUpdate(id, updateExpenseDto, { new: true });
    if (currentExpense.type === ExpenseTypes.purchase) updatedExpense = await this.updatePayments(currentExpense, updatedExpense);

    return updatedExpense;
  }

  async remove(id: string) {
    return this.expenseModel.findByIdAndUpdate(id, { isActive: false });
  }

  private async getCreditCard(creditCardId: string, user: User): Promise<CreditCard> {
    return await this.creditCardsService.findOne(creditCardId, user);
  }

  private async createPaymentsFromNewPurchase(newExpense: Expense): Promise<Payment[]> {
    const newPayments: Promise<Payment>[] = [];
    let remainingAmount = newExpense.amount;
    let remainingInstallments = newExpense.installments;
    let period = newExpense.firstPaymentDate;
    for (let paymentNo = 1; paymentNo <= newExpense.installments; paymentNo++) {
      const installmentAmount = calculateInstallmentAmount(remainingAmount, remainingInstallments);
      newPayments.push(
        this.paymentModel.create({
          status: PaymentStatus.unconfirmed,
          amount: installmentAmount,
          noInstallment: paymentNo,
          month: period.getUTCMonth() + 1,
          year: period.getUTCFullYear(),
          expense: newExpense._id,
        }),
      );
      remainingAmount -= installmentAmount;
      remainingInstallments--;
      period = getNextMonth(period);
    }
    return await Promise.all(newPayments);
  }

  private async getFilter(user: User, options: OptionList): Promise<FilterQuery<Expense>> {
    const creditCardList = await this.getCreditCardList(user, options.creditCardId);
    const filter: FilterQuery<Expense> = {
      isActive: true,
      creditCard: { $in: creditCardList },
    };

    if (options.type) filter.type = options.type;

    return filter;
  }

  private async getCreditCardList(user: User, creditCardId?: string): Promise<Types.ObjectId[]> {
    if (creditCardId) return [new Types.ObjectId(creditCardId)];
    const creditCards = await this.creditCardsService.findAll(user, { limit: 99, offset: 0 }); // TODO: permit all
    return creditCards.map((creditCard) => creditCard._id);
  }

  private async updatePayments(currentExpense: Expense, updatedExpense: Expense): Promise<Expense> {
    const currentPayments = await this.paymentModel.find({ expense: currentExpense._id });
    if (currentExpense.firstPaymentDate !== updatedExpense.firstPaymentDate) {
      let period = updatedExpense.firstPaymentDate;
      const updatePeriodPromises = currentExpense.payments.map(async (paymentId) => {
        const promise = this.paymentModel
          .findByIdAndUpdate(paymentId, {
            month: period.getUTCMonth() + 1,
            year: period.getUTCFullYear(),
          })
          .exec();
        period = getNextMonth(period);
        return promise;
      });
      await Promise.all(updatePeriodPromises);
    }
    if (currentExpense.amount !== updatedExpense.amount) {
      const unconfirmedPayments = currentPayments.filter((payment) => payment.status === PaymentStatus.unconfirmed);
      if (unconfirmedPayments.length === 0)
        HandleHttpErrors.badRequest("All of this purchase's payments are confirmed or paid, you cannot change the total amount.");
      const paidOrConfirmedAmount = currentPayments.reduce(
        (acc, payment) => acc + (payment.status === PaymentStatus.unconfirmed ? 0 : payment.amount),
        0,
      );
      if (paidOrConfirmedAmount > updatedExpense.amount)
        HandleHttpErrors.badRequest(
          `The new total amount cannot be less than the current paid or confirmed amount (${amountToStringCurrencyFormat(paidOrConfirmedAmount)})`,
        );
      let remainingAmount = updatedExpense.amount - paidOrConfirmedAmount;
      let remainingInstallments = unconfirmedPayments.length;
      const updateAmountPromises = unconfirmedPayments.map(async (payment) => {
        const newAmount = calculateInstallmentAmount(remainingAmount, remainingInstallments);
        const promise = this.paymentModel.findByIdAndUpdate(payment, { amount: newAmount }).exec();
        remainingAmount -= newAmount;
        remainingInstallments--;
        return promise;
      });
      await Promise.all(updateAmountPromises);
    }
    if (currentExpense.installments !== updatedExpense.installments) {
      const unconfirmedPayments = currentPayments.filter((payment) => payment.status === PaymentStatus.unconfirmed);
      if (unconfirmedPayments.length !== currentPayments.length)
        HandleHttpErrors.badRequest("Just can change the installments' number if all of the payments are unconfirmed");
      const deletePromises = currentExpense.payments.map((paymentId) => this.paymentModel.findByIdAndDelete(paymentId).exec());
      await Promise.all(deletePromises);
      const newPayments = await this.createPaymentsFromNewPurchase(updatedExpense);
      updatedExpense.payments = newPayments.map((payment) => payment._id);
      await updatedExpense.save();
    }
    return updatedExpense.populate('payments');
  }
}
