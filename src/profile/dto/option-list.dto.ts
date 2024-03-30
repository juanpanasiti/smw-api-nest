import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto';

export class OptionsList extends PaginationDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  userInfo?: boolean;
}