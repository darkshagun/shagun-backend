import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { User } from '../user.schema';

export class CreateUserDto {
  @IsNotEmpty()
  fullname: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  password_change: boolean;

  @IsNotEmpty()
  is_active: boolean;

  @IsNotEmpty()
  @IsNotEmpty()
  usergroup: string;

  @IsNotEmpty()
  pilot_user: boolean;

  created_at: string;

  updated_at: string

}
export class UpdateUserDto extends PartialType(
  CreateUserDto,
) { }