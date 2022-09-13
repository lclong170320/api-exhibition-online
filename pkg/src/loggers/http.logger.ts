import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { pino } from 'pino';
import { pinoHttp } from 'pino-http';

@Injectable()
export class HttpLogger {
    private logger = pinoHttp({
        stream: pino.destination({
            dest: process.env.ACCESS_LOG_FILE,
            sync: false,
        }),
    });

    log(request: Request, response: Response) {
        this.logger(request, response);
    }
}
