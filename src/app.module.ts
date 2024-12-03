import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './users/users.module';
import { ApolloDriver } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { PackagesModule } from './packages/packages.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    GraphQLModule.forRoot({
       autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    UserModule,
    AuthModule,
    PackagesModule,
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 100,
    }]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
