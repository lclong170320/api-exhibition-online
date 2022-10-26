import { Injectable } from '@nestjs/common';
import { pino } from 'pino';
import PinoPretty from 'pino-pretty';

@Injectable()
export class Logger {
    private logger = pino(
        {
            level: process.env.LOG_LEVEL,
        },
        PinoPretty(),
    );

    error(error: Error) {
        this.logger.error(error.stack ?? error);
    }

    warn(error: Error) {
        this.logger.warn(error.stack ?? error);
    }
}
