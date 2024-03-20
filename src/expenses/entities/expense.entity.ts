import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Expense extends Document {
  @Prop()
  title: string;

  @Prop()
  ccName: string;

  @Prop()
  acquiredAt: Date;

  //   @Prop()
  //   creditCardId: string;

  @Prop()
  type: 'subscription' | 'purchase';

  @Prop()
  amount: number;

  @Prop()
  installments: number;

  @Prop()
  isActive: boolean; // true by default
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
