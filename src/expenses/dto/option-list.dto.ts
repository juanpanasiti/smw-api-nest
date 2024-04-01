import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto';
import { ExpenseTypes } from '../enums';

export class OptionList extends PaginationDto {
  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  creditCardId?: string;

  @ApiProperty()
  @IsEnum(ExpenseTypes)
  @IsOptional()
  type: ExpenseTypes;
}
