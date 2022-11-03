import { DbConnection } from '@/database/config/db';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExhibitionConverter } from '../exhibition/converters/exhibition.converter';
import { Exhibition } from '../exhibition/entities/exhibition.entity';

@Injectable()
export class PublicService {
    constructor(
        @InjectRepository(Exhibition, DbConnection.exhibitionCon)
        private readonly exhibitionRepository: Repository<Exhibition>,
        private readonly exhibitionConverter: ExhibitionConverter,
    ) {}

    async getExhibitionById(id: string, query: PaginateQuery) {
        const exhibitionId = parseInt(id);
        const populatableColumns = [
            'booths',
            'booths.boothData',
            'booths.boothTemplate',
            'booths.locationStatus',
            'boothOrganization',
            'boothOrganization.boothTemplate',
            'boothOrganization.boothTemplate.positionBooths',
            'boothOrganization.boothOrganizationData',
            'boothTemplates.positionBooths',
            'boothTemplates',
            'category',
            'space.spaceTemplate',
            'space.spaceDatas',
            'space.spaceTemplate.positionSpaces',
            'space',
            'spaceTemplate',
            'spaceTemplate.positionSpaces',
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
}
