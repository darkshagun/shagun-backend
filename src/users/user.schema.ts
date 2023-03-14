import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { DefaultSchemaOptions } from 'src/app/base.schema';

export type UserDocument = User & Document;

@Schema(DefaultSchemaOptions)
export class User {

  @Prop({ maxlength: 40 })
  uuid: string;

  @Prop({ required: true, maxlength: 50 })
  fullname: string;

  @Prop({ required: true })
  password: string;

  @Prop({ maxlength: 100 })
  image: string;

  @Prop({ required: true, maxlength: 128 })
  username: string;

  @Prop({ maxlength: 128 })
  email?: string;

  @Prop()
  password_change: boolean;

  @Prop()
  is_active: boolean;

  @Prop({ required: true, maxlength: 50 })
  usergroup: string;

  @Prop({ maxlength: 1000 })
  address?: string;

  @Prop()
  age?: number;

  @Prop()
  designation?: string;

  @Prop({ maxlength: 15 })
  dob?: Date;

  @Prop({ maxlength: 15 })
  gender?: string;

  @Prop()
  pilot_user?: boolean;

  @Prop({ maxlength: 100 })
  executive_type?: string;

  @Prop({ default: [] })
  permissions: string[];

  @Prop()
  createdBy: string;

  @Prop()
  updatedBy: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const UserSchema =SchemaFactory.createForClass(User)
