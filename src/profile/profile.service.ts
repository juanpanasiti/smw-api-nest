import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './entities/profile.entity';
import { Model } from 'mongoose';
import { CreateProfileDto, UpdateProfileDto } from './dto';
import { HandleDbErrors } from 'src/common/error-handlers';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<Profile>,
  ) {}
  async create(createProfileDto: CreateProfileDto, user: User) {
    try {
      const newProfile = await this.profileModel.create({ ...createProfileDto, user: user._id});
      
      return newProfile;
    } catch (error) {
      HandleDbErrors.handle(error);
    }
  }

  findAll() {
    return `This action returns all profile`;
  }

  async findOne(id: string, user: User) {
    const profile = await this.getOneFromDb({ _id: user.profile });
    if (!profile) HandleDbErrors.handle({ code: 'NOT_FOUND', message: 'Profile not found' });
    return profile;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }

  private async getOneFromDb(query: object, populate: string = ''): Promise<Profile> {
    try {
      return await this.profileModel.findOne({ ...query, isActive: true }).populate(populate).exec();
    } catch (error) {
      HandleDbErrors.handle(error);
    }
  }

}
