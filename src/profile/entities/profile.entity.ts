import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Profile extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  birthDate: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
