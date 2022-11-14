import { DbConnection } from '@/database/config/db';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ExhibitionConverter } from '../exhibition/converters/exhibition.converter';
import { Exhibition } from '../exhibition/entities/exhibition.entity';
import { MediaConverter } from '@/components/media/converters/media.converter';
import { Media } from '@/components/media/entities/media.entity';

@Injectable()
export class PublicService {
    constructor(
        @InjectRepository(Exhibition, DbConnection.exhibitionCon)
        private readonly exhibitionRepository: Repository<Exhibition>,
        @InjectDataSource(DbConnection.mediaCon)
        private readonly mediaDataSource: DataSource,
        private readonly exhibitionConverter: ExhibitionConverter,
        private readonly mediaConverter: MediaConverter,
    ) {}

    async getExhibitionById(id: string, query: PaginateQuery) {
        const exhibitionId = parseInt(id);
        const populatableColumns = [
            'booths',
            'booths.boothTemplate',
            'booths.location.spaceTemplateLocation',
            'space',
            'space.spaceTemplate',
            'space.spaceImages.image',
            'space.spaceImages.spaceTemplatePosition',
            'space.spaceVideos.video',
            'space.spaceVideos.spaceTemplatePosition',
        ];

        const exhibitionEntity = await this.exhibitionRepository.findOne({
            where: {
                id: exhibitionId,
            },
            relations: this.parsePopulate(query.populate, populatableColumns),
        });

        if (!exhibitionEntity) {
            throw new NotFoundException(`The 'id' not found: ${exhibitionId}`);
        }

        return this.exhibitionConverter.toDto(exhibitionEntity);
    }

    private parsePopulate(populate: string[], populatableColumns: string[]) {
        return populate.filter((value) => populatableColumns.includes(value));
    }

    async getMediaById(id: string) {
        const mediaId = parseInt(id);

        const mediaRepository =
            this.mediaDataSource.manager.getRepository(Media);

        const mediaEntity = await mediaRepository.findOne({
            where: {
                id: mediaId,
            },
        });

        if (!mediaEntity) {
            throw new NotFoundException(`The 'id' not found: ${mediaId}`);
        }

        return this.mediaConverter.toDto(mediaEntity);
    }
}
