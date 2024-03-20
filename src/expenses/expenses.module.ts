import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './entities/expense.entity';

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
  ],
})
export class ExpensesModule {}
