import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { AuthResponseDto, LoginUserDto, RegisterUserDto } from './dto';
import { Auth } from './decorators/auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService // Dependency Injection
    ) {}

  @Post('/register')
  @ApiResponse({ status: 201, description: 'Register new user', type: AuthResponseDto })
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('/login')
  @ApiResponse({ status: 201, description: 'Login user', type: AuthResponseDto })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('/token')
  @Auth()
  @ApiResponse({ status: 200, description: 'Get new token', type: AuthResponseDto })
  renewToken(@GetUser() user: User) {
    return this.authService.renewToken(user);
  }

}
