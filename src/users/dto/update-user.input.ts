import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, MinLength, IsEmail } from 'class-validator';
import { Role } from '../enums/role.enum';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(6)
  password?: string;

  @Field(() => Role, { nullable: true })
  @IsOptional()
  role?: Role;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;
} 