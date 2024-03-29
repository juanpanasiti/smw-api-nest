import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MongooseError } from 'mongoose';

export class HandleDbErrors {
  private static DUPLICATE_KEY_CODE = 11000;
  private static VALIDATION_ERROR_CODE = 'ValidationError';
  private static NOT_FOUND = 'NOT_FOUND';

  public static handle(error: any): never {
    if (error.code === this.DUPLICATE_KEY_CODE) throw new BadRequestException(`Duplicated key ${JSON.stringify(error['keyValue'])}`);
    if (error.name === this.VALIDATION_ERROR_CODE) throw new BadRequestException(error.message);
    if (error.code === this.NOT_FOUND) throw new NotFoundException(error.message);

    console.error(error);
    if (error instanceof MongooseError) throw new InternalServerErrorException('Unhandled error with db operation.');

    throw new InternalServerErrorException('Internal Server Error, contact sysadmin');
  }
}
