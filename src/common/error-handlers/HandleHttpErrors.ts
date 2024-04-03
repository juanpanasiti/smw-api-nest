import { BadRequestException } from '@nestjs/common';

export class HandleHttpErrors {
  private static BAD_REQUEST_DEFAULT_MSG = 'Not specified';
  private static NOT_FOUND_DEFAULT_MSG = 'Not specified';
  public static badRequest(message: string = this.BAD_REQUEST_DEFAULT_MSG): never {
    throw new BadRequestException(`Bad Request: ${message}`);
  }
  public static notFound(message: string = this.NOT_FOUND_DEFAULT_MSG): never {
    throw new BadRequestException(`Not Found: ${message}`);
  }
}
