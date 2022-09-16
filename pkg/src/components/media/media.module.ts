import { DbConnection } from '@/database/config/db';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Logger } from '@/loggers/default.logger';
import { MediaConverter } from './converters/media.converter';

@Module({
    controllers: [MediaController],
    providers: [MediaService, Logger, MediaConverter],
    imports: [TypeOrmModule.forFeature([Media], DbConnection.mediaCon)],
    exports: [TypeOrmModule],
})
export class MediaModule {}
