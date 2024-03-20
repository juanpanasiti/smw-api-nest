import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CreditCard extends Document {
  @Prop({ unique: true, index: true })
  name: string;

  @Prop({ min: 0 })
  limit: number;

  //   @Prop()
  //   mainCreditCard: mongoId;

  //   @Prop()
  //   userId: mongoId;

  @Prop()
  nextClosingDate: Date;

  @Prop()
  nextExpiringDate: Date;
}

export const CreditCardSchema = SchemaFactory.createForClass(CreditCard);
