import { DbConnection } from '@/database/config/db';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Buffer } from 'buffer';
import * as fileType from 'file-type';
import { promises } from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { paginate, FilterOperator } from 'nestjs-paginate';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { v4 as uuid } from 'uuid';
import { MediaConverter } from './converters/media.converter';
import { MediaResponse } from './dto/media-response.dto';
import { Media as MediaDto } from './dto/media.dto';
import { Media } from './entities/media.entity';
import { MediaListConverter } from './converters/media-list.converter';

@Injectable()
export class MediaService {
    private readonly limitDefault = 10;

    constructor(
        @InjectRepository(Media, DbConnection.mediaCon)
        private readonly mediaRepository: Repository<Media>,
        private configService: ConfigService,
        private mediaConverter: MediaConverter,
        private mediaListConverter: MediaListConverter,
    ) {}

    async getMedias(query: PaginateQuery) {
        const medias = await paginate(query, this.mediaRepository, {
            maxLimit: query.limit,
            defaultLimit: this.limitDefault,
            sortableColumns: ['id', 'mime', 'userId', 'createdAt'],
            defaultSortBy: [['createdAt', 'DESC']],
            searchableColumns: ['id', 'mime', 'userId', 'createdAt'],
            filterableColumns: {
                userId: [FilterOperator.EQ, FilterOperator.IN],
            },
        });

        return this.mediaListConverter.toDto(
            medias.meta.currentPage,
            medias.meta.itemsPerPage,
            medias.meta.totalItems,
            medias.data,
        );
    }

    async generateMedia(mediaDto: MediaDto): Promise<MediaDto> {
        const allowExtension = this.configService
            .get<string>('ALLOW_UPLOAD_FILE')
            .split(',');

        const buf = Buffer.from(mediaDto.data, 'base64');
        const type = await fileType.fromBuffer(buf);
        const fileName = uuid();
        const serveStatic = this.configService.get<string>('SERVE_STATIC');

        const filePath = path.join(
            __dirname,
            `../../../resources/${fileName}.${type.ext}`,
        );

        const url = `${serveStatic}${fileName}.${type.ext}`;

        const ext = type.mime.split('/')[1];

        if (!allowExtension.includes(ext)) {
            throw new BadRequestException('Not allowed extension: ' + ext);
        }

        await promises.writeFile(filePath, buf);

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
