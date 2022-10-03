import { ErrorDetail } from '@/components/exhibition/dto/error-detail.dto';
import { ErrorResponseBody } from '@/components/exhibition/dto/error-response-body.dto';
import { Logger } from '@/loggers/default.logger';
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpError as OpenapiHttpError } from 'express-openapi-validator/dist/framework/types';
import { isHttpError, HttpError } from 'http-errors';

@Catch(Error)
export class AppExceptionFilter implements ExceptionFilter<Error> {
    constructor(private readonly logger: Logger) {}

    catch(error: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const response = ctx.getResponse<Response>();

        const { status, responseBody } = this.handleError(error);

        response.status(status).json(responseBody);
    }

    handleError(error: Error) {
        if (isHttpError(error)) {
            if (error.status < 500) {
                this.logger.warn(error.message, error.stack);
            } else {
                this.logger.error(error.message, error.stack);
            }
            return this.handleHTTPErrors(error);
        }

        if (error instanceof OpenapiHttpError) {
            this.logger.warn(error.message, error.stack);
            return this.handleOpenapiHttpError(error);
        }

        if (error instanceof HttpException) {
            if (error.getStatus() < 500) {
                this.logger.warn(error.message, error.stack);
            } else {
                this.logger.error(error.message, error.stack);
            }
            return this.handleHTTPException(error);
        }

        this.logger.error(error.message, error.stack);
        return this.handleUnknownError(error);
    }

    handleHTTPErrors(error: HttpError) {
        const responseBody: ErrorResponseBody = {
            message: error.name,
            details: [
                {
                    field: '',
                    message: error.message,
                },
            ],
        };

        return {
            status: error.status,
            responseBody: responseBody,
        };
    }

    handleHTTPException(exception: HttpException) {
        const responseBody: ErrorResponseBody = {
            message: exception.name,
            details: [
                {
                    field: '',
                    message: exception.message,
                },
            ],
        };

        return {
            status: exception.getStatus(),
            responseBody: responseBody,
        };
    }

    handleOpenapiHttpError(error: OpenapiHttpError) {
        const responseBody: ErrorResponseBody = {
            message: error.name,
            details: error.errors.map((e): ErrorDetail => {
                return {
                    field: e.path,
                    message: e.message,
                };
            }),
        };

        return {
            status: error.status,
            responseBody: responseBody,
        };
    }

    handleUnknownError(error: Error) {
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            responseBody: {
                message: error.name,
                details: [
                    {
                        field: '',
                        message: error.message,
                    },
                ],
            },
        };
    }
}
