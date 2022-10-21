import { SpaceTemplateConverter } from '@/components/exhibition/converters/space-template.converter';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';
import { DbConnection } from '@/database/config/db';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { SpaceTemplateListConverter } from '../converters/space-template-list.converter';

@Injectable()
export class SpaceTemplateService {
    private readonly limitDefault = 10;
    constructor(
        @InjectRepository(SpaceTemplate, DbConnection.exhibitionCon)
        private readonly spaceTemplateRepository: Repository<SpaceTemplate>,
        private spaceTemplateConverter: SpaceTemplateConverter,
        private spaceTemplateListConverter: SpaceTemplateListConverter,
    ) {}

    async findSpaceTemplateById(id: string, populate: string[]) {
        const firstSpaceTemplate = await this.spaceTemplateRepository.findOne({
            where: {
                id: parseInt(id),
            },
            relations: populate,
        });

        if (!firstSpaceTemplate) {
            throw new NotFoundException(`The 'space_id' ${id} is not found`);
        }

        return this.spaceTemplateConverter.toDto(firstSpaceTemplate);
    }

    async getSpaceTemplates(query: PaginateQuery) {
        const relations = this.parseRelations(query.populate);
        const spaceTemplate = await paginate(
            query,
            this.spaceTemplateRepository,
            {
                maxLimit: query.limit,
                defaultLimit: this.limitDefault,
                sortableColumns: ['id', 'name'],
                defaultSortBy: [['createdAt', 'DESC']],
                searchableColumns: ['id', 'name'],
                filterableColumns: {
                    name: [FilterOperator.EQ, FilterOperator.IN],
                },
                relations: relations,
            },
        );

        return this.spaceTemplateListConverter.toDto(
            spaceTemplate.meta.currentPage,
            spaceTemplate.meta.itemsPerPage,
            spaceTemplate.meta.totalItems,
            spaceTemplate.data,
        );
    }

    private parseRelations(relations: string[]) {
        const results: ('spaces' | 'positionSpaces' | 'exhibitions')[] = [];
        for (const relation of relations) {
            if (relation === 'spaces') {
                results.push('spaces');
            }
            if (relation === 'positionSpaces') {
                results.push('positionSpaces');
            }
            if (relation === 'exhibitions') {
                results.push('exhibitions');
            }
        }

        return results;
    }
}
