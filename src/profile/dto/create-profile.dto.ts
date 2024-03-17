import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  // @IsMongoId
  // readonly userId: mongoId

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsDateString({ strictSeparator: false, strict: true })
  @IsOptional()
  readonly birthDate?: string;
}
