import { Injectable, Logger as NestLogger } from '@nestjs/common';
import { pino } from 'pino';

@Injectable()
export class Logger extends NestLogger {
    private logger = pino(
        {
            level: process.env.LOG_LEVEL,
        },
        pino.destination(process.env.ERROR_LOG_FILE),
    );

    error(message: string, stackTrace: string) {
        this.logger.error(message, stackTrace);
    }

    warn(message: string, stackTrace?: string) {
        this.logger.warn(message, stackTrace);
    }

    info(message: string, stackTrace?: string) {
        this.logger.info(message, stackTrace);
    }
}
