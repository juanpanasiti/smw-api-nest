import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateProfileDto } from 'src/profile/dto';

export class RegisterUserDto extends CreateProfileDto {
  @IsString()
  @MinLength(8)
  @MaxLength(25)
  readonly username: string;

  @IsEmail({}, { message: 'Is not a valid email' })
  @MaxLength(50)
  readonly email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  readonly password: string;
}
