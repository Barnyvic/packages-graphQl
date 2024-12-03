import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, Min } from 'class-validator';

@InputType()
export class CreatePackageInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  @Min(0)
  price: number;

  @Field(() => Date)
  expirationDate: Date;
}
