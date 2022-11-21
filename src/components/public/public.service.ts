import { DbConnection } from '@/database/config/db';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ExhibitionConverter } from '@/components/public/converters/exhibition/exhibition.converter';
import {
    Exhibition,
    Status as StatusExhibition,
} from '@/components/exhibition/entities/exhibition.entity';
import { MediaConverter } from '@/components/public/converters/media/media.converter';
import { Media } from '@/components/media/entities/media.entity';
import { Enterprise } from '@/components/enterprise/entities/enterprise.entity';
import { EnterpriseConverter } from '@/components/public/converters/enterprise/enterprise.converter';

@Injectable()
export class PublicService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly exhibitionDataSource: DataSource,
        @InjectDataSource(DbConnection.mediaCon)
        private readonly mediaDataSource: DataSource,
        @InjectDataSource(DbConnection.enterpriseCon)
        private readonly enterpriseDataSource: DataSource,
        private readonly exhibitionConverter: ExhibitionConverter,
        private readonly mediaConverter: MediaConverter,
        private readonly enterpriseConverter: EnterpriseConverter,
    ) {}

    async getExhibitionById(id: string, query: PaginateQuery) {
        const exhibitionRepository =
            this.exhibitionDataSource.manager.getRepository(Exhibition);
        const exhibitionEntity = await exhibitionRepository.findOne({
            where: {
                id: parseInt(id),
                status: StatusExhibition.LISTING,
            },
            relations: query.populate,
        });

        if (!exhibitionEntity) {
            throw new NotFoundException(`The 'id' not found: ${id}`);
        }
        return this.exhibitionConverter.toDto(exhibitionEntity);
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

    async getEnterpriseById(id: string) {
        const enterpriseRepository =
            this.enterpriseDataSource.manager.getRepository(Enterprise);
        const enterprise = await enterpriseRepository.findOne({
            where: {
                id: parseInt(id),
            },
        });
        return this.enterpriseConverter.toDto(enterprise);
    }
}
