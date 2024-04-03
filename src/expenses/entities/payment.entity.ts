import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentStatus } from '../enums';
import { Month } from '../types';
import { transformDoc } from 'src/common/constants';

@Schema()
export class Payment extends Document {
  @Prop()
  status: PaymentStatus;

  @Prop()
  amount: number;

  @Prop()
  noInstallment: number;

  @Prop({min: 1, max: 12})
  month: Month;

  @Prop()
  year: number;

  @Prop({ type: Types.ObjectId, ref: 'Expense', required: true })
  expense: Types.ObjectId;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: transformDoc
});