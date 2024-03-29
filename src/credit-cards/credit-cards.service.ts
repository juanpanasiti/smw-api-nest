import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreditCard } from './entities/credit-card.entity';
import { CreateCreditCardDto, UpdateCreditCardDto } from './dto';
import { HandleDbErrors } from 'src/common/error-handlers';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto';
import { PAGE_LIMIT, PAGE_OFFSET } from 'src/common/constants';

@Injectable()
export class CreditCardsService {
  constructor(
    @InjectModel(CreditCard.name)
    private readonly creditCardModel: Model<CreditCard>,
  ) {}

  async create(createCreditCardDto: CreateCreditCardDto, user: User) {
    try {
      const newCreditCard = await this.creditCardModel.create({ ...createCreditCardDto, owner: user });
      return newCreditCard;
    } catch (error) {
      HandleDbErrors.handle(error);
    }
  }

  async findAll(user: User, pagination: PaginationDto) {
    const { limit = PAGE_LIMIT, offset = PAGE_OFFSET } = pagination;
    const query = this.creditCardModel.find({ owner: user._id }).limit(limit).skip(offset);
    const creditCardList = await query.exec();
    return creditCardList;
  }

  async findOne(id: string, user: User) {
    const creditCard = await this.getOneFromDb({ _id: id, owner: user._id });
    if (!creditCard) HandleDbErrors.handle({ code: 'NOT_FOUND', message: 'Credit card not found' });
    return creditCard;
  }

  async update(id: string, user: User, updateCreditCardDto: UpdateCreditCardDto) {
    const oldCreditCard = await this.getOneFromDb({ _id: id, owner: user._id });
    if (!oldCreditCard) HandleDbErrors.handle({ code: 'NOT_FOUND', message: 'Credit card not found' });
    return await this.creditCardModel.findByIdAndUpdate(id, updateCreditCardDto, { new: true });
  }

  async remove(id: string, user: User) {
    const oldCreditCard = await this.getOneFromDb({ _id: id, owner: user._id });
    if (!oldCreditCard) HandleDbErrors.handle({ code: 'NOT_FOUND', message: 'Credit card not found' });
    await this.creditCardModel.findByIdAndUpdate(id, {isActive: false});
  }

  private async getOneFromDb(query: object): Promise<CreditCard> {
    try {
      return await this.creditCardModel.findOne({...query, isActive: true}).exec();
    } catch (error) {
      HandleDbErrors.handle(error);
    }
  }
}
