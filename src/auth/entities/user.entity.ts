import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { ValidRoles } from '../interfaces';

@Schema()
export class User extends Document {
  @Prop({ unique: true, index: true, required: true })
  username: string;

  @Prop({ unique: true, index: true, required: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: [ValidRoles.user] })
  roles: ValidRoles[];

  @Prop({ type: Types.ObjectId, ref: 'Profile', default: null })
  profile: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
