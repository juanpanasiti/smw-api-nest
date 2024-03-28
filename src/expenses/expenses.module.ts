import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense, ExpenseSchema } from './entities/expense.entity';
import { AuthModule } from '../auth/auth.module';

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
    AuthModule,
  ],
})
export class ExpensesModule {}
