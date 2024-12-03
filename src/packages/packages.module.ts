import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesResolver } from './packages.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Package, PackageSchema } from './schema/package.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
    AuthModule,
  ],
  providers: [PackagesService, PackagesResolver],
})
export class PackagesModule {}
