import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';

@Module({
  imports: [AuthModule, ProfileModule, CreditCardsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
