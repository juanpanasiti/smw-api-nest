import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CreditCardsService } from './credit-cards.service';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCard, CreditCardSchema } from './entities/credit-card.entity';
import { AuthModule } from '../auth/auth.module';

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
  ],
})
export class CreditCardsModule {}
