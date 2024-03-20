import { Module } from '@nestjs/common';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsController } from './credit-cards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditCard, CreditCardSchema } from './entities/credit-card.entity';

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
  ],
})
export class CreditCardsModule {}
