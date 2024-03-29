import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto, UpdateCreditCardDto } from './dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dto';
import { ResponseInterceptor } from 'src/common/interceptors/response/response.interceptor';

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
  findAll(@Query() pagination: PaginationDto, @GetUser() user: User) {
    return this.creditCardsService.findAll(user, pagination);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.creditCardsService.findOne(id, user);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateCreditCardDto: UpdateCreditCardDto, @GetUser() user: User) {
    return this.creditCardsService.update(id, user, updateCreditCardDto);
  }
  
  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.creditCardsService.remove(id, user);
  }
}
