import { DbConnection } from '@/database/config/db';
import {
    NotFoundException,
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';
import { BoothOrganizationTemplate } from '../entities/booth-organization-template.entity';
import { BoothOrganizationTemplateConverter } from '../converters/booth-organization-template.converter';

import { BoothOrganizationTemplateListConverter } from '../converters/booth-organization-template-list.converter';

@Injectable()
export class BoothOrganizationTemplateService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private boothOrganizationTemplateConverter: BoothOrganizationTemplateConverter,
        private boothOrganizationTemplateListConverter: BoothOrganizationTemplateListConverter,
    ) {}

    async findBoothOrganizationTemplateById(id: string, populate: string[]) {
        const boothOrganizationTemplateRepository =
            this.dataSource.manager.getRepository(BoothOrganizationTemplate);
        const allowPopulate = ['boothOrganizationTemplatePositions'];

        populate.forEach((value) => {
            if (!allowPopulate.includes(value)) {
                throw new BadRequestException(
                    'Query value is not allowed ' + value,
                );
            }
        });
        const firstBoothOrganizationTemplate =
            await boothOrganizationTemplateRepository.findOne({
                where: {
                    id: parseInt(id),
                },
                relations: populate,
            });

        if (!firstBoothOrganizationTemplate) {
            throw new NotFoundException(`The 'booth_id' ${id} is not found`);
        }

        return this.boothOrganizationTemplateConverter.toDto(
            firstBoothOrganizationTemplate,
        );
    }

    async findBoothOrganizationTemplates(query: PaginateQuery) {
        const sortableColumns = ['id', 'name', 'createdAt'];
        const searchableColumns = ['name'];
        const filterableColumns = [''];
        const defaultSortBy = [['createdAt', 'DESC']];
        const populatableColumns = ['boothOrganizationTemplatePositions'];
        const boothOrganizationTemplateRepository =
            this.dataSource.manager.getRepository(BoothOrganizationTemplate);
        const [boothTemplates, total] = await paginate(
            query,
            boothOrganizationTemplateRepository,
            {
                searchableColumns,
                sortableColumns,
                populatableColumns,
                filterableColumns,
                defaultSortBy,
            },
        );

        return this.boothOrganizationTemplateListConverter.toDto(
            query.page,
            query.limit,
            total,
            boothTemplates,
        );
    }

    async deleteBoothOrganizationTemplate(id: string) {
        await this.dataSource.transaction(async (manager) => {
            const boothOrganizationTemplateRepository = manager.getRepository(
                BoothOrganizationTemplate,
            );

            const firstBoothOrganizationTemplate =
                await boothOrganizationTemplateRepository.findOneBy({
                    id: parseInt(id),
                });

            if (!firstBoothOrganizationTemplate) {
                throw new NotFoundException('Not found');
            }

            await boothOrganizationTemplateRepository.softRemove(
                firstBoothOrganizationTemplate,
            );
        });
    }
}
