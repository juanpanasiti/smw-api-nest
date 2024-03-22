import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true, index: true, required: true })
  username: string;

  @Prop({ unique: true, index: true, required: true })
  email: string;

  @Prop({required: true, select: false})
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
