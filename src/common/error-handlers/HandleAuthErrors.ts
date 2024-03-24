import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

export class HandleAuthErrors {
  private static LOGIN_ERROR = 'LOGIN_ERROR';
  private static INVALID_TOKEN = 'INVALID_TOKEN';
  private static USER_NOT_FOUND_REQ = 'USER_NOT_FOUND_REQ';

  public static handle(error: any): never {
    // 400
    if (error === this.LOGIN_ERROR) throw new UnauthorizedException('Invalid credentials');
    if (error === this.INVALID_TOKEN) throw new UnauthorizedException('Invalid Token');
    // 500
    if (error === this.USER_NOT_FOUND_REQ) throw new InternalServerErrorException('User not found (request)');
    throw new InternalServerErrorException('Internal Server Error, contact sysadmin');
  }

  public static loginError() {
    this.handle(this.LOGIN_ERROR);
  }

  public static invalidToken() {
    this.handle(this.INVALID_TOKEN);
  }

  public static userNotFoundInRequest() {
    this.handle(this.USER_NOT_FOUND_REQ)
  }
}
