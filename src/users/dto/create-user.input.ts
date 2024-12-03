import { InputType, Field } from '@nestjs/graphql';
import { Role } from '../enums/role.enum';
import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  username: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field(() => Role, { defaultValue: Role.User })
  role?: Role;

  @Field()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}
