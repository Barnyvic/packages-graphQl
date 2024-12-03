import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class SearchPackageArgs {
  @Field({ nullable: true })
  searchTerm?: string;

  @Field(() => [String], { nullable: true })
  fields?: string[];
}
