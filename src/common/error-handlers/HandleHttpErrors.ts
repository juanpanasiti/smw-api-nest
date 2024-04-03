import { BadRequestException } from '@nestjs/common';

export class HandleHttpErrors {
  private static BAD_REQUEST_DEFAULT_MSG = 'No specified';
  public static badRequest(message: string = this.BAD_REQUEST_DEFAULT_MSG): never {
    throw new BadRequestException(`Bad Request: ${message}`);
  }
}
