import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { HandleDbErrors } from 'src/common/HandleDbErrors';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    try {
      const {password, ...userData} = registerUserDto
      const user = await this.userModel.create({...userData, password: this.encryptPassword(password)});
      return user;
    } catch (error) {
      HandleDbErrors.handle(error);
    }
  }

  login(loginUserDto: LoginUserDto) {
    return `This action login a user and return auth data`;
  }

  renewToken(oldToken: string) {
    return `This action returns a new token`;
  }

  private encryptPassword(password): string {
    return bcrypt.hashSync(password, 10)
  }
}
