import { DbConnection } from '@/database/config/db';
import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';
import { SpaceTemplateConverter } from '@/components/exhibition/converters/space-template.converter';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate, FilterOperator } from 'nestjs-paginate';
import { SpaceTemplateListConverter } from '@/components/exhibition/converters/space-template-list.converter';

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
        const spaceTemplate = await paginate(
            query,
            this.spaceTemplateRepository,
            {
                maxLimit: query.limit,
                defaultLimit: this.limitDefault,
                sortableColumns: ['id', 'createdAt'],
                defaultSortBy: [['createdAt', 'DESC']],
                searchableColumns: ['id', 'name', 'createdAt'],
                filterableColumns: {
                    name: [FilterOperator.EQ, FilterOperator.IN],
                },
            },
        );

        return this.spaceTemplateListConverter.toDto(
            spaceTemplate.meta.currentPage,
            spaceTemplate.meta.itemsPerPage,
            spaceTemplate.meta.totalItems,
            spaceTemplate.data,
        );
    }
}
