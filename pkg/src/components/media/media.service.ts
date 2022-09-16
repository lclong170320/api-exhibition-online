import { DbConnection } from '@/database/config/db';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { Repository } from 'typeorm';
import { Media as MediaDto } from './dto/media.dto';
import { Media } from './entities/media.entity';
import * as fileType from 'file-type';
import { Buffer } from 'buffer';
import { ConfigService } from '@nestjs/config';
import { MediaConverter } from './converters/media.converter';
import { uuid } from 'uuidv4';
import { MediaResponse } from './dto/media-response.dto';

@Injectable()
export class MediaService {
    constructor(
        @InjectRepository(Media, DbConnection.mediaCon)
        private readonly mediaRepository: Repository<Media>,
        private configService: ConfigService,
        private mediaConverter: MediaConverter,
    ) {}

    async generateMedia(mediaDto: MediaDto): Promise<MediaDto> {
        const allowExtension = this.configService
            .get<string>('ALLOW_UPLOAD_FILE')
            .split(',');

        const buf = Buffer.from(mediaDto.data, 'base64');
        const type = await fileType.fromBuffer(buf);
        const fileName = uuid();
        const pathToResource =
            this.configService.get<string>('PATH_TO_RESOURCES');
        const serveStatic = this.configService.get<string>('SERVE_STATIC');

        const path = `${pathToResource}${fileName}.${type.ext}`;
        const url = `${serveStatic}${fileName}.${type.ext}`;

        const ext = type.mime.split('/')[1];

        if (!allowExtension.includes(ext)) {
            throw new BadRequestException('Not allowed extension: ' + ext);
        }

        await promises.writeFile(path, buf);

        return {
            url: url,
            mime: type.mime,
            // TODO: handle getUserId from access token
            user_id: 1,
        } as MediaDto;
    }

    async createMedia(mediaDto: MediaDto): Promise<MediaResponse> {
        const media = await this.generateMedia(mediaDto);
        const mediaEntity = this.mediaConverter.toEntity(media);

        const createdMedia = await this.mediaRepository.save(mediaEntity);

        return this.mediaConverter.toDto(createdMedia);
    }

    async findById(id: string): Promise<MediaResponse> {
        const mediaId = parseInt(id);
        const firstMedia = await this.mediaRepository.findOneBy({
            id: mediaId,
        });
        return this.mediaConverter.toDto(firstMedia);
    }
}
