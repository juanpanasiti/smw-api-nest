import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [AuthModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
