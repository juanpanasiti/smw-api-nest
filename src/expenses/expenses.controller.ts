import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, OptionList, UpdateExpenseDto, UpdatePaymentDto } from './dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ResponseInterceptor } from 'src/common/interceptors/response/response.interceptor';

@UseInterceptors(ResponseInterceptor)
@ApiTags('Expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Auth()
  create(@Body() createExpenseDto: CreateExpenseDto, @GetUser() user: User) {
    return this.expensesService.create(createExpenseDto, user);
  }

  @Get()
  @Auth()
  findAll(@Query() options: OptionList, @GetUser() user: User) {
    return this.expensesService.findAll(user, options);
  }
  
  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }
  
  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto, @GetUser() user: User) {
    return this.expensesService.update(id, updateExpenseDto, user);
  }
  @Patch(':id/payments/:paymentId')
  @Auth()
  update_payment(@Param('id') id: string,@Param('paymentId') paymentId: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.expensesService.updatePayment(id, paymentId, updatePaymentDto);
  }
  
  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
