import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

export class HandleDbErrors {
  public static  handle(error: any) {
    if (error.code === 'some') throw new BadRequestException(error.detail);

    console.log(error)
    throw new InternalServerErrorException('Internal Server Error, contact sysadmin')
  }
}
