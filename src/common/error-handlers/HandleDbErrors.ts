import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { MongooseError } from 'mongoose';

export class HandleDbErrors {
  private static DUPLICATE_KEY_CODE = 11000;
  private static VALIDATION_ERROR_CODE = 'ValidationError';

  public static handle(error: any): never {
    if (error.code === this.DUPLICATE_KEY_CODE) throw new BadRequestException(`Duplicated key ${JSON.stringify(error['keyValue'])}`);
    if (error.name === this.VALIDATION_ERROR_CODE) throw new BadRequestException(error.message);

    console.error(error);
    if (error instanceof MongooseError) throw new InternalServerErrorException('Unhandled error with db operation.');

    throw new InternalServerErrorException('Internal Server Error, contact sysadmin');
  }
}
