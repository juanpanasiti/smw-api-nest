import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreditCard } from './entities/credit-card.entity';
import { CreateCreditCardDto, UpdateCreditCardDto } from './dto';

@Injectable()
export class CreditCardsService {
  constructor(
    @InjectModel(CreditCard.name)
    private readonly creditCardModel: Model<CreditCard>,
  ) {}
  
  create(createCreditCardDto: CreateCreditCardDto) {
    return 'This action adds a new creditCard';
  }

  findAll() {
    return `This action returns all creditCards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} creditCard`;
  }

  update(id: number, updateCreditCardDto: UpdateCreditCardDto) {
    return `This action updates a #${id} creditCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} creditCard`;
  }
}
