import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Profile extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  birthDate: string;

  @Prop()
  creditCardAmountAlert: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  user: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
