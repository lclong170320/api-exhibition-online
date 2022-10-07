import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HttpLogger } from 'loggers/http.logger';

@Injectable()
export class AccessLoggerMiddleware
    implements NestMiddleware<Request, Response>
{
    constructor(private readonly httpLogger: HttpLogger) {}

    use(req: Request, res: Response, next: NextFunction) {
        this.httpLogger.log(req, res);
        next();
    }
}
