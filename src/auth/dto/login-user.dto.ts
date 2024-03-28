import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @ApiProperty({ example: 'your_username', nullable: false, minLength: 8 })
  readonly username: string;

  @IsString()
  @ApiProperty({ example: 'your_password', nullable: false, minLength: 8 })
  readonly password: string;
}
