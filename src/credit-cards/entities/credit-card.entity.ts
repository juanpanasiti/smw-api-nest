import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { transformDoc } from 'src/common/constants';

@Schema()
export class CreditCard extends Document {
  @Prop()
  name: string;

  @Prop({ min: 0, default: 0 })
  limit: number;

  @Prop({default: null})
  nextClosingDate: Date | null;
  
  @Prop({default: null})
  nextExpiringDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', unique: false })
  owner: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CreditCard', default: null })
  mainCreditCard: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'CreditCard', default: [] })
  extensions: Types.ObjectId[];



  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}
export const CreditCardSchema = SchemaFactory.createForClass(CreditCard);

CreditCardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: transformDoc
});
