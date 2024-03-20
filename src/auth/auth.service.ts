import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  register(registerUserDto: RegisterUserDto) {
    //
  }

  login(loginUserDto: LoginUserDto) {
    return `This action login a user and return auth data`;
  }

  renewToken(oldToken: string) {
    return `This action returns a new token`;
  }
}
