/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArgumentsHost,
  Catch,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

interface ErrorResponse {
  message: string;
  extensions: {
    code: string;
    status: number;
    [key: string]: any;
  };
}

@Catch()
@Injectable()
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): GraphQLError {
    const gqlHost = GqlArgumentsHost.create(host);

    let errorResponse: ErrorResponse;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message || 'An error occurred';

      errorResponse = {
        message,
        extensions: {
          code: this.getGraphQLErrorCode(status),
          status,
        },
      };
    } else {
      // For unexpected errors
      errorResponse = {
        message: 'Internal server error',
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          status: 500,
        },
      };
      console.error('Unexpected error:', exception);
    }

    return new GraphQLError(errorResponse.message, {
      extensions: errorResponse.extensions,
    });
  }

  private getGraphQLErrorCode(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return 'UNPROCESSABLE_ENTITY';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}
