import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense, ExpenseSchema, Payment, PaymentSchema } from './entities';
import { AuthModule } from '../auth/auth.module';
import { CreditCardsModule } from 'src/credit-cards/credit-cards.module';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Expense.name,
        schema: ExpenseSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
    ]),
    AuthModule,
    forwardRef(() => CreditCardsModule),
  ],
  exports: [ExpensesService],
})
export class ExpensesModule {}
