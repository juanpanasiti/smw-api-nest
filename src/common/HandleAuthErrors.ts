import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

export class HandleAuthErrors {
  private static LOGIN_ERROR = 'LOGIN_ERROR';

  public static handle(error: any): never {
    if (error === this.LOGIN_ERROR) throw new UnauthorizedException('Invalid credentials');
    throw new InternalServerErrorException('Internal Server Error, contact sysadmin');
  }

  public static loginError() {
    this.handle(this.LOGIN_ERROR);
  }
}
