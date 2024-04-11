import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { ExpenseTypes } from '../enums';
import { transformDoc } from 'src/common/constants';

@Schema()
export class Expense extends Document {
  @Prop()
  title: string;

  @Prop()
  ccName: string;

  @Prop()
  acquiredAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'CreditCard', required: true })
  creditCard: Types.ObjectId;

  @Prop()
  type: ExpenseTypes;

  @Prop()
  amount: number;

  @Prop()
  installments: number;

  @Prop()
  firstPaymentDate: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Payment', default: [] })
  payments: Types.ObjectId[];

  @Prop()
  isActive: boolean; // true by default

  @Prop()
  isDone: boolean; // false by default
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

ExpenseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: transformDoc,
});
