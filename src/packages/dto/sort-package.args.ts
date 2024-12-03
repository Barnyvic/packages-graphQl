import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
});

@ArgsType()
export class SortPackageArgs {
  @Field(() => String, { defaultValue: 'name' })
  sortBy: string;

  @Field(() => SortOrder, { defaultValue: SortOrder.ASC })
  order: SortOrder;
}
