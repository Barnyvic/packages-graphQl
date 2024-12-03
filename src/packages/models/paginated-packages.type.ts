import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PackageType } from './package.type';

@ObjectType()
export class PaginatedPackagesResponse {
  @Field(() => [PackageType])
  items: PackageType[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  take: number;
} 