import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreditCard } from './entities/credit-card.entity';
import { CreateCreditCardDto, UpdateCreditCardDto } from './dto';
import { HandleDbErrors } from 'src/common/error-handlers';
import { User } from 'src/auth/entities/user.entity';
import { PAGE_LIMIT, PAGE_OFFSET } from 'src/common/constants';
import { ListOptions } from './dto/list-options.dto';

@Injectable()
export class CreditCardsService {
  constructor(
    @InjectModel(CreditCard.name)
    private readonly creditCardModel: Model<CreditCard>,
  ) {}

  async create(createCreditCardDto: CreateCreditCardDto, user: User) {
    const mainCreditCard = await this.getMainCreditCard(createCreditCardDto, user);
    const creditCardData = this.cleanCreditCardDto(createCreditCardDto);
    try {
      const newCreditCard = await this.creditCardModel.create({ ...creditCardData, owner: user, mainCreditCard: mainCreditCard });
      this.addNewExtension(mainCreditCard, newCreditCard);

      return newCreditCard;
    } catch (error) {
      HandleDbErrors.handle(error);
    }
  }

  async findAll(user: User, options?: ListOptions) {
    // TODO: Add option to get all cc and select fields
    const { limit = PAGE_LIMIT, offset = PAGE_OFFSET } = options;
    let query = this.creditCardModel.find({ owner: user._id });
    const populate = this.getPopulateString(options, query);

    query = query.limit(limit).skip(offset);
    const creditCardList = await query.populate(populate).exec();
    return creditCardList;
  }

  async findOne(id: string, user: User, options: ListOptions = {}) {
    const populate = this.getPopulateString(options);
    const creditCard = await this.getOneFromDb({ _id: id, owner: user._id }, populate);
    if (!creditCard) HandleDbErrors.handle({ code: 'NOT_FOUND', message: 'Credit card not found' });
    return creditCard;
  }

  async update(id: string, user: User, updateCreditCardDto: UpdateCreditCardDto) {
    const mainCreditCard = await this.getMainCreditCard(updateCreditCardDto, user);
    const oldCreditCard = await this.getOneFromDb({ _id: id, owner: user._id });
    if (!oldCreditCard) HandleDbErrors.handle({ code: 'NOT_FOUND', message: 'Credit card not found' });
    const updatedCreditCard = await this.creditCardModel.findByIdAndUpdate(id, updateCreditCardDto, { new: true });
    if (updateCreditCardDto.mainCreditCard) this.addNewExtension(mainCreditCard, oldCreditCard);
    return updatedCreditCard;
  }

  async removeExtension(mainId: string, extensionId: string, user: User) {
    const mainCreditCard = await this.getOneFromDb({ _id: mainId, owner: user._id });
    const extension = await this.getOneFromDb({ _id: extensionId, owner: user._id });
    mainCreditCard.extensions = mainCreditCard.extensions.filter((id) => id.toString() !== extensionId);
    extension.mainCreditCard = null;
    await Promise.all([mainCreditCard.save(), extension.save()]);
  }

  async delete(id: string, user: User) {
    const oldCreditCard = await this.getOneFromDb({ _id: id, owner: user._id });
    if (!oldCreditCard) HandleDbErrors.handle({ code: 'NOT_FOUND', message: 'Credit card not found' });
    await this.creditCardModel.findByIdAndUpdate(id, { isActive: false });
  }

  private async getOneFromDb(query: object, populate: string = ''): Promise<CreditCard> {
    try {
      return await this.creditCardModel
        .findOne({ ...query, isActive: true })
        .populate(populate)
        .exec();
    } catch (error) {
      HandleDbErrors.handle(error);
    }
  }

  private cleanCreditCardDto({ mainCreditCard = null, name, ...restCreditCardData }: UpdateCreditCardDto): UpdateCreditCardDto {
    if (!mainCreditCard) return { name, ...restCreditCardData };
    return { name };
  }

  private async addNewExtension(creditCard: CreditCard, extension: CreditCard) {
    if (!creditCard || creditCard.extensions.includes(extension._id)) return;
    creditCard.extensions.push(extension._id);
    await creditCard.save();
  }

  private async getMainCreditCard(createCreditCardDto: UpdateCreditCardDto, user: User) {
    let mainCreditCard: CreditCard;
    if (createCreditCardDto.mainCreditCard) {
      mainCreditCard = await this.getOneFromDb({ owner: user._id, _id: createCreditCardDto.mainCreditCard, mainCreditCard: null });
      if (!mainCreditCard) HandleDbErrors.handle({ code: 'NOT_FOUND', message: 'Main Credit card not found' });
    }
    return mainCreditCard;
  }

  private getPopulateString(options: ListOptions, query?: any) {
    const { onlyMain = false } = options;
    let populate = '';
    if (onlyMain) {
      if (query) query = query.where('mainCreditCard').equals(null);
      populate = 'extensions';
    }
    return populate;
  }
}
