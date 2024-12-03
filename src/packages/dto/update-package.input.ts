import { InputType, Field, Float, ID } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';

@InputType()
export class UpdatePackageInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => Float, { nullable: true })
  @Min(0)
  @IsOptional()
  price?: number;
}
