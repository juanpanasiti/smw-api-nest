import { IsDateString, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsDateString({ strictSeparator: false, strict: true })
  @IsOptional()
  readonly birthDate?: string;

  @IsPositive()
  @IsOptional()
  readonly creditCardAmountAlert?: number;
}
