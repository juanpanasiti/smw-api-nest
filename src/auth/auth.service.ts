import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  register(registerUserDto: RegisterUserDto) {
    return 'This action register a new user';
  }

  login(loginUserDto: LoginUserDto) {
    return `This action login a user and return auth data`;
  }

  renewToken(oldToken: string) {
    return `This action returns a new token`;
  }
}
