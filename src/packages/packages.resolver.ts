import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PackagesService } from './packages.service';
import { CreatePackageInput } from './dto/create-package.dto';
import { UpdatePackageInput } from './dto/update-package.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../users/enums/role.enum';
import { PackageType } from './models/package.type';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { SearchPackageArgs } from './dto/search-package.args';
import { PaginationArgs } from './dto/pagination.args';

@Resolver(() => PackageType)
export class PackagesResolver {
  constructor(private readonly packageService: PackagesService) {}

  @Mutation(() => PackageType)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async createPackage(
    @Args('createPackageInput') createPackageInput: CreatePackageInput,
  ) {
    return this.packageService.create(createPackageInput);
  }

  @Query(() => [PackageType], { name: 'packages' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  async findAll(
    @Args('expirationDate', { type: () => Date, nullable: true })
    expirationDate?: Date,
    @Args() paginationArgs?: PaginationArgs,
  ) {
    if (expirationDate) {
      return this.packageService.findByExpirationDate(
        expirationDate,
        paginationArgs,
      );
    }
    return this.packageService.findAll(paginationArgs);
  }

  @Query(() => PackageType, { name: 'package' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.packageService.findOne(id);
  }

  @Mutation(() => PackageType)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updatePackage(
    @Args('updatePackageInput') updatePackageInput: UpdatePackageInput,
  ) {
    return this.packageService.update(updatePackageInput);
  }

  @Mutation(() => PackageType)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async deletePackage(@Args('id', { type: () => ID }) id: string) {
    return this.packageService.remove(id);
  }

  @Query(() => [PackageType], { name: 'searchPackages' })
  @UseGuards(GqlAuthGuard)
  async searchPackages(@Args() searchArgs: SearchPackageArgs) {
    return this.packageService.search(searchArgs);
  }
}
