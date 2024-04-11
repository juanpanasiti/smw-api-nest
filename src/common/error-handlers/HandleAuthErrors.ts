import { ForbiddenException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ValidRoles } from 'src/auth/interfaces';

export class HandleAuthErrors {
  private static LOGIN_ERROR = 'LOGIN_ERROR';
  private static INVALID_TOKEN = 'INVALID_TOKEN';
  private static USER_NOT_FOUND_REQ = 'USER_NOT_FOUND_REQ';
  private static USER_FORBIDDEN_ACCESS = 'USER_FORBIDDEN_ACCESS';

  private static handle(error: any, message?: string): never {
    // 400
    if (error === this.LOGIN_ERROR) throw new UnauthorizedException(message || 'Invalid credentials');
    if (error === this.INVALID_TOKEN) throw new UnauthorizedException(message || 'Invalid Token');
    if (error === this.USER_FORBIDDEN_ACCESS) throw new ForbiddenException(message || 'User has no needed role');
    // 500
    if (error === this.USER_NOT_FOUND_REQ) throw new InternalServerErrorException(message || 'User not found (request)');
    throw new InternalServerErrorException(message || 'Internal Server Error, contact sysadmin');
  }

  public static loginError() {
    this.handle(this.LOGIN_ERROR);
  }

  public static invalidToken() {
    this.handle(this.INVALID_TOKEN);
  }

  public static userNotFoundInRequest() {
    this.handle(this.USER_NOT_FOUND_REQ);
  }

  public static userForbiddenAccess(message?: string) {
    this.handle(this.USER_FORBIDDEN_ACCESS, message);
  }
}
