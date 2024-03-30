import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto, UpdateCreditCardDto } from './dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ResponseInterceptor } from 'src/common/interceptors/response/response.interceptor';
import { ListOptions } from './dto/list-options.dto';

@UseInterceptors(ResponseInterceptor)
@ApiTags('Credit Cards')
@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Post()
  @Auth()
  create(@Body() createCreditCardDto: CreateCreditCardDto, @GetUser() user: User) {
    return this.creditCardsService.create(createCreditCardDto, user);
  }

  @Get()
  @Auth()
  findAll(@Query() options: ListOptions, @GetUser() user: User) {
    return this.creditCardsService.findAll(user, options);
  }

  @Get(':id')
  @Auth()
  findOne(@Query() options: ListOptions, @Param('id') id: string, @GetUser() user: User) {
    return this.creditCardsService.findOne(id, user, options);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateCreditCardDto: UpdateCreditCardDto, @GetUser() user: User) {
    return this.creditCardsService.update(id, user, updateCreditCardDto);
  }

  @Patch(':mainId/remove-extension/:extId')
  @Auth()
  removeExtension(@Param('mainId') mainId, @Param('extId') extId: string, @GetUser() user: User) {
    return this.creditCardsService.removeExtension(mainId, extId, user);
  }

  @Delete(':id')
  @Auth()
  delete(@Param('id') id: string, @GetUser() user: User) {
    return this.creditCardsService.delete(id, user);
  }
}
