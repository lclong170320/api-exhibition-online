import { DbConnection } from '@/database/config/db';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MediaConverter } from './converters/media.converter';
import { MediaListConverter } from './converters/media-list.converter';

@Module({
    controllers: [MediaController],
    providers: [MediaService, MediaConverter, MediaListConverter],
    imports: [TypeOrmModule.forFeature([Media], DbConnection.mediaCon)],
    exports: [TypeOrmModule],
})
export class MediaModule {}
