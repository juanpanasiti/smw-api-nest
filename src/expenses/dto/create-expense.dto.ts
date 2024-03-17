import { IsBoolean, IsDecimal, IsInt, IsPositive, IsString, MaxDate } from "class-validator";

export class CreateExpenseDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly ccName: string;
  
  @MaxDate(new Date(), {message: 'must be today or before'})
  readonly acquiredAt: Date;

  // @IsMongoId
  // readonly creditCardId: mongoId

  @IsString()
  readonly type: 'subscription' | 'purchase';

  @IsPositive()
  @IsDecimal({decimal_digits: '0,2'})
  readonly amount: number;

  @IsPositive()
  @IsInt()
  readonly installments: number;

  @IsBoolean()
  readonly isActive: boolean; // true by default
}
