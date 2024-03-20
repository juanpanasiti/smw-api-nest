import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, ProfileModule, CreditCardsModule, ExpensesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
