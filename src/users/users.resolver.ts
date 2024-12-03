import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserType } from './models/users.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => UserType)
  async register(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: any) {
    return this.userService.findById(user.userId);
  }
}
