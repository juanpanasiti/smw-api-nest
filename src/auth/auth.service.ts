import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { HandleAuthErrors, HandleDbErrors } from 'src/common/error-handlers';
import { AuthResponseDto, LoginUserDto, RegisterUserDto } from './dto';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @Inject(forwardRef(() => ProfileService))
    private readonly profileService: ProfileService,

    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    try {
      const { username, id, profile, email } = await this.createUserWithProfile(registerUserDto);

      const token = this.getToken({ userId: id });
      return { id, username, email, profile, token };
    } catch (error) {
      HandleDbErrors.handle(error);
    }
  }

  async login(loginCredentials: LoginUserDto): Promise<AuthResponseDto> {
    const user = await this.userModel
      .findOne({ username: loginCredentials.username })
      .select(['username', 'password', 'profile', 'email'])
      .populate('profile');
    if (!user || !this.checkPassword(loginCredentials.password, user.password)) HandleAuthErrors.loginError();
    const { username, id, profile, email } = user;
    const token = this.getToken({ userId: id });
    return { id, username, email, profile, token };
  }

  async renewToken(user: User): Promise<AuthResponseDto> {
    const { id, username, email } = user;
    const token = this.getToken({ userId: id });
    const profile = await this.profileService.findOne(user.profile.toString(), user, {});
    return { id, username, email, profile, token };
  }

  private encryptPassword(password): string {
    return bcrypt.hashSync(password, 10);
  }

  private checkPassword(password, encryptedPassword): boolean {
    return bcrypt.compareSync(password, encryptedPassword);
  }

  private getToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private async createUserWithProfile(registerUserDto: RegisterUserDto) {
    const { password, profileData, ...userData } = this.cleanData(registerUserDto);
    const user = await this.userModel.create({ ...userData, password: this.encryptPassword(password) });
    const profile = await this.profileService.create(profileData, user);
    return await this.userModel.findByIdAndUpdate(user.id, { profile: profile._id }, { new: true }).populate('profile');
  }

  private cleanData(registerUserDto: RegisterUserDto) {
    const { password, username, email, ...profileData } = registerUserDto;
    return { password, username, email, profileData };
  }
}
