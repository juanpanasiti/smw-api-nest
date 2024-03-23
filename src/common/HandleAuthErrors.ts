import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

export class HandleAuthErrors {
  private static LOGIN_ERROR = 'LOGIN_ERROR';
  private static INVALID_TOKEN = 'INVALID_TOKEN';

  public static handle(error: any): never {
    if (error === this.LOGIN_ERROR) throw new UnauthorizedException('Invalid credentials');
    if (error === this.INVALID_TOKEN) throw new UnauthorizedException('Invalid Token')
    throw new InternalServerErrorException('Internal Server Error, contact sysadmin');
  }

  public static loginError() {
    this.handle(this.LOGIN_ERROR);
  }

  public static invalidToken() {
    this.handle(this.INVALID_TOKEN);
  }
}
