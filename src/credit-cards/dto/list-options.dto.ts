import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto';

export class ListOptions extends PaginationDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  onlyMain?: boolean;
}
