import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsPositive, IsString, MaxDate, MinLength } from 'class-validator';

import { ExpenseTypes } from '../enums';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Something cool', nullable: false })
  @IsString()
  @MinLength(3)
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly ccName: string;

  @MaxDate(new Date(), { message: 'acquiredAt must be today or before' })
  readonly acquiredAt: Date;

  @IsMongoId()
  readonly creditCardId: string;

  @IsString()
  @IsEnum(ExpenseTypes)
  readonly type: ExpenseTypes;

  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  readonly amount: number;

  @IsPositive()
  @IsInt()
  readonly installments: number;

  @IsDate()
  readonly firstPaymentDate: Date;
}
