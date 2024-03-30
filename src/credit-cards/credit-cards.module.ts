import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CreditCardsService } from './credit-cards.service';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCard, CreditCardSchema } from './entities/credit-card.entity';
import { AuthModule } from '../auth/auth.module';
import { ExpensesModule } from 'src/expenses/expenses.module';

@Module({
  controllers: [CreditCardsController],
  providers: [CreditCardsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: CreditCard.name,
        schema: CreditCardSchema,
      },
    ]),
    AuthModule,
    forwardRef(() => ExpensesModule),
  ],
  exports: [CreditCardsService],
})
export class CreditCardsModule {}
