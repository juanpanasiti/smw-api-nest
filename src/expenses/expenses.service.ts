import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Expense, Payment } from './entities';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
import { User } from 'src/auth/entities/user.entity';
import { CreditCardsService } from 'src/credit-cards/credit-cards.service';
import { CreditCard } from 'src/credit-cards/entities/credit-card.entity';
import { PaymentStatus } from './enums';
import { calculateInstallmentAmount, getNextMonth } from './helpers';

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
    const newExpense = await this.expenseModel.create({ ...expenseData, creditCard: creditCard._id });
    let newPayments;
    // Create the payments
    if (newExpense.type === 'purchase') newPayments = await this.createPaymentsFromNewPurchase(newExpense);
    newExpense.payments = newPayments.map(payment => payment._id);
    await newExpense.save();

    return newExpense.populate('payments');
  }

  findAll() {
    return `This action returns all expenses`;
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
          month: period.getMonth() + 1,
          year: period.getFullYear(),
          expense: newExpense._id,
        }),
      );
      remainingAmount -= installmentAmount;
      remainingInstallments--;
      period = getNextMonth(period);
    }
    return await Promise.all(newPayments);
  }
}
