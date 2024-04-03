import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

import { PaymentStatus } from '../enums';

export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  @IsEnum(PaymentStatus)
  readonly status?: PaymentStatus;

  @IsOptional()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  readonly amount?: number;
}
