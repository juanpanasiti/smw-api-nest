import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [AuthModule, ProfileModule, CreditCardsModule, ExpensesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
