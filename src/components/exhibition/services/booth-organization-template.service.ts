import { DbConnection } from '@/database/config/db';
import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';
import { BoothOrganizationTemplate } from '@/components/exhibition/entities/booth-organization-template.entity';
import { BoothOrganizationTemplateConverter } from '@/components/exhibition/converters/booth-organization-template.converter';
import { BoothOrganizationTemplatePositionConverter } from '@/components/exhibition/converters/booth-organization-template-position.converter';
import { PaginatedBoothOrganizationTemplatesConverter } from '@/components/exhibition/converters/paginated-booth-organization-templates.converter';
import { BoothOrganizationTemplate as BoothOrganizationTemplateDto } from '@/components/exhibition/dto/booth-organization-template.dto';
import { BoothOrganizationTemplatePosition as BoothOrganizationTemplatePositionDto } from '@/components/exhibition/dto/booth-organization-template-position.dto';
import { BoothOrganizationTemplatePosition } from '@/components/exhibition/entities/booth-organization-template-position.entity';
import { User } from '@/components/exhibition/dto/user.dto';

@Injectable()
export class BoothOrganizationTemplateService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private boothOrganizationTemplateConverter: BoothOrganizationTemplateConverter,
        private boothOrganizationTemplatePositionConverter: BoothOrganizationTemplatePositionConverter,
        private paginatedBoothOrganizationTemplatesConverter: PaginatedBoothOrganizationTemplatesConverter,
    ) {}

    async readBoothOrganizationTemplateById(id: string, query: PaginateQuery) {
        const boothOrganizationTemplateRepository =
            this.dataSource.manager.getRepository(BoothOrganizationTemplate);

        const firstBoothOrganizationTemplate =
            await boothOrganizationTemplateRepository.findOne({
                where: {
                    id: parseInt(id),
                },
                relations: query.populate,
                withDeleted: query.withDeleted,
            });

        if (!firstBoothOrganizationTemplate) {
            throw new NotFoundException(`The 'booth_id' ${id} is not found`);
        }

        return this.boothOrganizationTemplateConverter.toDto(
            firstBoothOrganizationTemplate,
        );
    }

    async readBoothOrganizationTemplates(query: PaginateQuery) {
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
                withDeleted: query.withDeleted,
            },
        );

        return this.paginatedBoothOrganizationTemplatesConverter.toDto(
            query.page,
            query.limit,
            total,
            boothTemplates,
        );
    }

    async createBoothOrganizationTemplate(
        jwtAccessToken: string,
        user: User,
        boothOrganizationTemplateDto: BoothOrganizationTemplateDto,
    ) {
        const createdBoothOrganizationTemplate =
            await this.dataSource.transaction(async (manager) => {
                const boothOrganizationTemplateRepository =
                    manager.getRepository(BoothOrganizationTemplate);
                const boothOrganizationTemplatePositionRepository =
                    manager.getRepository(BoothOrganizationTemplatePosition);

                const boothOrganizationTemplateEntity =
                    await this.boothOrganizationTemplateConverter.toEntity(
                        boothOrganizationTemplateDto,
                        user.id,
                        jwtAccessToken,
                    );
                const createdBoothTemplateOrganization =
                    await boothOrganizationTemplateRepository.save(
                        boothOrganizationTemplateEntity,
                    );
                const boothTemplatePosition = await Promise.all(
                    boothOrganizationTemplateDto.booth_organization_template_positions.map(
                        async (data) => {
                            const boothTemplatePosition =
                                await this.createBoothOrganizationTemplatePosition(
                                    data,
                                    createdBoothTemplateOrganization,
                                    boothOrganizationTemplatePositionRepository,
                                );
                            return boothTemplatePosition;
                        },
                    ),
                );
                createdBoothTemplateOrganization.boothOrganizationTemplatePositions =
                    boothTemplatePosition;

                return createdBoothTemplateOrganization;
            });

        return this.boothOrganizationTemplateConverter.toDto(
            createdBoothOrganizationTemplate,
        );
    }

    private async createBoothOrganizationTemplatePosition(
        boothOrganizationTemplatePositionDto: BoothOrganizationTemplatePositionDto,
        boothOrganizationTemplateEntity: BoothOrganizationTemplate,
        boothOrganizationTemplatePositionRepository: Repository<BoothOrganizationTemplatePosition>,
    ): Promise<BoothOrganizationTemplatePosition> {
        const boothOrganizationTemplatePositionEntity =
            this.boothOrganizationTemplatePositionConverter.toEntity(
                boothOrganizationTemplatePositionDto,
            );

        boothOrganizationTemplatePositionEntity.boothOrganizationTemplate =
            boothOrganizationTemplateEntity;

        const createdBoothOrganizationTemplatePosition =
            await boothOrganizationTemplatePositionRepository.save(
                boothOrganizationTemplatePositionEntity,
            );

        return createdBoothOrganizationTemplatePosition;
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
