import { PartialType } from '@nestjs/mapped-types';
import { CreateCreditCardDto } from '.';

export class UpdateCreditCardDto extends PartialType(CreateCreditCardDto) {}
