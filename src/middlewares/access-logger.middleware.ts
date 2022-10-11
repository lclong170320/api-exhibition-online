import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { HttpLogger } from 'loggers/http.logger';

@Injectable()
export class AccessLoggerMiddleware
    implements NestMiddleware<Request, Response>
{
    constructor(
        private readonly httpLogger: HttpLogger,
        private readonly configService: ConfigService,
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        if (this.configService.get('IS_ENABLE_ACCESS_LOGGER') === 'true') {
            this.httpLogger.log(req, res);
        }
        next();
    }
}
