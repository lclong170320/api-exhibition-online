import { DbConnection } from '@/database/config/db';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { Buffer } from 'buffer';
import * as fileType from 'file-type';
import { promises } from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { paginate } from '@/utils/pagination';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { v4 as uuid } from 'uuid';
import { MediaConverter } from './converters/media.converter';
import { MediaResponse } from './dto/media-response.dto';
import { Media as MediaDto } from './dto/media.dto';
import { Media } from './entities/media.entity';
import { PaginatedMediasConverter } from './converters/paginated-medias.converter';

@Injectable()
export class MediaService {
    constructor(
        @InjectDataSource(DbConnection.mediaCon)
        private readonly dataSource: DataSource,
        private configService: ConfigService,
        private mediaConverter: MediaConverter,
        private paginatedMediasConverter: PaginatedMediasConverter,
    ) {}

    async readMedias(query: PaginateQuery) {
        const sortableColumns = ['id', 'mime', 'userId', 'createdAt'];
        const searchableColumns = ['id', 'mime', 'userId', 'createdAt'];
        const filterableColumns = ['userId'];
        const defaultSortBy = [['createdAt', 'DESC']];
        const populatableColumns = query.populate;
        const mediaRepository = this.dataSource.manager.getRepository(Media);
        const [medias, total] = await paginate(query, mediaRepository, {
            searchableColumns,
            sortableColumns,
            populatableColumns,
            filterableColumns,
            defaultSortBy,
        });

        return this.paginatedMediasConverter.toDto(
            query.page,
            query.limit,
            total,
            medias,
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
        const mediaRepository = this.dataSource.manager.getRepository(Media);
        const media = await this.generateMedia(mediaDto);
        const mediaEntity = this.mediaConverter.toEntity(media);

        const createdMedia = await mediaRepository.save(mediaEntity);

        return this.mediaConverter.toDto(createdMedia);
    }

    async readById(id: string): Promise<MediaResponse> {
        const mediaRepository = this.dataSource.manager.getRepository(Media);

        const firstMedia = await mediaRepository.findOneBy({
            id: parseInt(id),
        });
        return this.mediaConverter.toDto(firstMedia);
    }
}
