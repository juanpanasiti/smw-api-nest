import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { Expense, Payment } from './entities';
import { CreateExpenseDto, OptionList, UpdateExpenseDto } from './dto';
import { User } from 'src/auth/entities/user.entity';
import { CreditCardsService } from 'src/credit-cards/credit-cards.service';
import { CreditCard } from 'src/credit-cards/entities/credit-card.entity';
import { PaymentStatus } from './enums';
import { calculateInstallmentAmount, getNextMonth } from './helpers';
import { PAGE_LIMIT, PAGE_OFFSET } from 'src/common/constants';

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
    const newExpense = await this.expenseModel.create({ ...expenseData, creditCard: creditCard._id, isActive: true });
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
    const creditCardList = await query.exec();
    return creditCardList;
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
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
}
