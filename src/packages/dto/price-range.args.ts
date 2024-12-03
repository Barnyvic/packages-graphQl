import { ArgsType, Field, Float } from '@nestjs/graphql';
import { Min } from 'class-validator';

@ArgsType()
export class PriceRangeArgs {
  @Field(() => Float)
  @Min(0)
  min: number;

  @Field(() => Float)
  @Min(0)
  max: number;
} 