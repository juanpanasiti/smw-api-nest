import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MongooseError } from 'mongoose';

export class HandleDbErrors {
  private static DUPLICATE_KEY_CODE = 11000;
  public static handle(error: any): never {
    if (error.code === this.DUPLICATE_KEY_CODE) throw new BadRequestException(`Duplicated key ${JSON.stringify(error['keyValue'])}`);

    console.log(error);
    if (error instanceof MongooseError) throw new InternalServerErrorException('Unhandled error with db operation.');

    throw new InternalServerErrorException('Internal Server Error, contact sysadmin');
  }
}
