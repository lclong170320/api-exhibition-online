import { ErrorDetail } from '@/components/exhibition/dto/error-detail.dto';
import { ErrorResponseBody } from '@/components/exhibition/dto/error-response-body.dto';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { error } from 'express-openapi-validator';

@Catch(...Object.values(error))
export class OpenApiExceptionFilter implements ExceptionFilter {
    catch(error: ValidationError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const responseBody: ErrorResponseBody = {
            message: error.name,
            details: error.errors.map((e): ErrorDetail => {
                return {
                    field: e.path,
                    message: e.message
                } as ErrorDetail
            })
        }

        response.status(error.status).header(error.headers).json(responseBody);
    }
}

interface ValidationError {
    status: number;
    message: string;
    errors: Array<{
        path: string;
        message: string;
        error_code?: string;
    }>;
    path?: string;
    name: string;
    headers: {
        [header: string]: string;
    };
}
