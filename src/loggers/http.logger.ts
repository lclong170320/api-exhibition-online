import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { pinoHttp } from 'pino-http';
import PinoPretty from 'pino-pretty';

@Injectable()
export class HttpLogger {
    private readonly logger = pinoHttp({
        stream: PinoPretty(),
    });

    log(request: Request, response: Response) {
        this.logger(request, response);
    }
}
