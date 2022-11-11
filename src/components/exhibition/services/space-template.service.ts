import { SpaceTemplateConverter } from '@/components/exhibition/converters/space-template.converter';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';
import { DbConnection } from '@/database/config/db';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';
import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpaceTemplateListConverter } from '../converters/space-template-list.converter';

@Injectable()
export class SpaceTemplateService {
    constructor(
        @InjectRepository(SpaceTemplate, DbConnection.exhibitionCon)
        private readonly spaceTemplateRepository: Repository<SpaceTemplate>,
        private spaceTemplateConverter: SpaceTemplateConverter,
        private spaceTemplateListConverter: SpaceTemplateListConverter,
    ) {}

    async findSpaceTemplateById(id: string, populate: string[]) {
        const populatableColumns = ['spaces', 'spaceTemplatePositions'];
        populate.forEach((value) => {
            if (!populatableColumns.includes(value)) {
                throw new BadRequestException(
                    'Query value is not allowed ' + value,
                );
            }
        });
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
        const sortableColumns = ['name', 'createdDate'];
        const searchableColumns = ['name'];
        const defaultSortBy = [['createdAt', 'DESC']];
        const populatableColumns = [
            'spaces',
            'spaceTemplatePositions',
            'spaceTemplateLocations',
        ];
        const [spaceTemplates, total] = await paginate(
            query,
            this.spaceTemplateRepository,
            {
                sortableColumns,
                defaultSortBy,
                searchableColumns,
                populatableColumns,
            },
        );

        return this.spaceTemplateListConverter.toDto(
            query.page,
            query.limit,
            total,
            spaceTemplates,
        );
    }
}
