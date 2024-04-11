import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './entities/profile.entity';
import { Model } from 'mongoose';
import { CreateProfileDto, OptionsList, UpdateProfileDto } from './dto';
import { HandleAuthErrors, HandleDbErrors } from 'src/common/error-handlers';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto, user: User) {
    try {
      const newProfile = await this.profileModel.create({ ...createProfileDto, user: user._id });

      return newProfile;
    } catch (error) {
      HandleDbErrors.handle(error);
    }
  }

  async findAll(options: OptionsList) {
    const { limit = 10, offset = 0, userInfo = true } = options;
    const populate = userInfo ? 'user' : '';
    return this.profileModel.find().limit(limit).skip(offset).populate(populate).exec();
  }

  async findOne(id: string, user: User, options?: OptionsList) {
    const { userInfo = false } = options;
    const populate = userInfo ? 'user' : '';
    this.checkPermissions(id, user);
    const profile = await this.getOneFromDb({ _id: id }, populate);
    if (!profile) HandleDbErrors.handle({ code: 'NOT_FOUND', message: 'Profile not found' });
    return profile;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto, user: User) {
    this.checkPermissions(id, user);
    const updatedProfile = await this.profileModel.findByIdAndUpdate(id, updateProfileDto, { new: true });
    return updatedProfile;
  }

  async remove(id: string) {
    await this.profileModel.findByIdAndUpdate(id, { isActive: false });
  }

  private async getOneFromDb(query: object, populate: string = ''): Promise<Profile> {
    try {
      return await this.profileModel
        .findOne({ ...query, isActive: true })
        .populate(populate)
        .exec();
    } catch (error) {
      HandleDbErrors.handle(error);
    }
  }

  private checkPermissions(profileId: string, user: User) {
    if (!user.roles.includes(ValidRoles.admin) && user.profile.toString() !== profileId)
      HandleAuthErrors.userForbiddenAccess(`User ${user.username} has no access to this profile`);
  }
}
