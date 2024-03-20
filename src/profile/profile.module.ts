import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './entities/profile.entity';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
  ],
})
export class ProfileModule {}
