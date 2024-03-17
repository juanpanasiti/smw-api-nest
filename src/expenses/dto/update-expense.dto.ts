import { OmitType } from '@nestjs/mapped-types';
import { CreateExpenseDto } from './create-expense.dto';

export class UpdateExpenseDto extends OmitType(CreateExpenseDto, ['type']) {}
