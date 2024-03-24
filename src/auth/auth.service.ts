import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponseDto } from './dto/auth-response.dto';
import { HandleAuthErrors, HandleDbErrors } from 'src/common/error-handlers';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    try {
      const { password, ...userData } = registerUserDto;
      const {username, id} = await this.userModel.create({ ...userData, password: this.encryptPassword(password) });
      const token = this.getToken({userId: id})
    return { username, id, token };
    } catch (error) {
      HandleDbErrors.handle(error);
    }
  }

  async login(loginCredentials: LoginUserDto): Promise<AuthResponseDto> {
    const user = await this.userModel.findOne({ username: loginCredentials.username }).select(['username', 'password']);
    if (!user || !this.checkPassword(loginCredentials.password, user.password)) HandleAuthErrors.loginError();
    const {username, id} = user
    const token = this.getToken({userId: id})
    return { username, id, token };
  }

  renewToken({username, id}: User): AuthResponseDto {
    const token = this.getToken({userId: id})
    return { username, id, token };
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
}
