import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { transformDoc } from 'src/common/constants';

@Schema()
export class CreditCard extends Document {
  @Prop()
  name: string;

  @Prop({ min: 0 })
  limit: number;

  @Prop()
  nextClosingDate: Date;

  @Prop()
  nextExpiringDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', unique: false })
  owner: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}
export const CreditCardSchema = SchemaFactory.createForClass(CreditCard);

CreditCardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: transformDoc
});
