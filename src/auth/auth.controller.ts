import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { LoginUserDto, RegisterUserDto } from './dto';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService // Dependency Injection
    ) {}

  @Post('/register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('/token')
  @Auth()
  renewToken(@GetUser() user: User) {
    return this.authService.renewToken(user);
  }

}
