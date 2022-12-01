import { DbConnection } from '@/database/config/db';
import {
    NotFoundException,
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { PaginatedBoothTemplatesConverter } from '@/components/exhibition/converters/paginated-booth-templates.converter';
import { BoothTemplateConverter } from '@/components/exhibition/converters/booth-template.converter';
import { DataSource } from 'typeorm';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';

import { BoothTemplate as BoothTemplateDto } from '@/components/exhibition/dto/booth-template.dto';
import { BoothTemplatePosition as BoothTemplatePositionDto } from '@/components/exhibition/dto/booth-template-position.dto';

import { BoothTemplatePosition } from '../entities/booth-template-position.entity';
import { BoothTemplatePositionConverter } from '../converters/booth-template-position.converter';
import { UtilService } from '@/utils/helper/util.service';
import { User } from '@/components/exhibition/dto/user.dto';

@Injectable()
export class BoothTemplateService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private paginatedBoothTemplatesConverter: PaginatedBoothTemplatesConverter,
        private boothTemplateConverter: BoothTemplateConverter,
        private boothTemplatePositionConverter: BoothTemplatePositionConverter,
        private readonly utilService: UtilService,
    ) {}

    async readBoothTemplateById(id: string, populate: string[]) {
        const boothTemplateRepository =
            this.dataSource.getRepository(BoothTemplate);

        const allowPopulate = ['boothTemplatePositions'];

        populate.forEach((value) => {
            if (!allowPopulate.includes(value)) {
                throw new BadRequestException(
                    'Query value is not allowed ' + value,
                );
            }
        });
        const firstBoothTemplate = await boothTemplateRepository.findOne({
            where: {
                id: parseInt(id),
            },
            relations: populate,
        });

        if (!firstBoothTemplate) {
            throw new NotFoundException(`The 'booth_id' ${id} is not found`);
        }

        return this.boothTemplateConverter.toDto(firstBoothTemplate);
    }

    async readBoothTemplates(query: PaginateQuery) {
        const sortableColumns = ['id', 'name', 'type', 'createdAt'];
        const searchableColumns = ['name'];
        const filterableColumns = ['type'];
        const defaultSortBy = [['createdAt', 'DESC']];
        const populatableColumns = query.populate;
        const boothTemplateRepository =
            this.dataSource.manager.getRepository(BoothTemplate);
        const [boothTemplates, total] = await paginate(
            query,
            boothTemplateRepository,
            {
                searchableColumns,
                sortableColumns,
                populatableColumns,
                filterableColumns,
                defaultSortBy,
            },
        );

        return this.paginatedBoothTemplatesConverter.toDto(
            query.page,
            query.limit,
            total,
            boothTemplates,
        );
    }

    async createBoothTemplate(
        jwtAccessToken: string,
        user: User,
        boothTemplateDto: BoothTemplateDto,
    ): Promise<BoothTemplateDto> {
        const createdBoothTemplate = await this.dataSource.transaction(
            async (manager) => {
                const boothTemplateRepository =
                    manager.getRepository(BoothTemplate);
                const boothTemplatePositionRepository = manager.getRepository(
                    BoothTemplatePosition,
                );

                const created_by = user.id;
                const boothTemplateEntity =
                    this.boothTemplateConverter.toEntity(boothTemplateDto);
                boothTemplateEntity.modelId =
                    await this.utilService.createUrlMedias(
                        boothTemplateDto.model_data,
                        jwtAccessToken,
                    );

                boothTemplateEntity.thumbnailId =
                    await this.utilService.createUrlMedias(
                        boothTemplateDto.thumbnail_data,
                        jwtAccessToken,
                    );
                boothTemplateEntity.createdBy = created_by;
                boothTemplateEntity.createdDate = new Date();
                const createdBoothTemplate = await boothTemplateRepository.save(
                    boothTemplateEntity,
                );
                const boothTemplatePosition = await Promise.all(
                    boothTemplateDto.booth_template_positions.map(
                        async (data) => {
                            const boothTemplatePosition =
                                await this.createBoothTemplatePosition(
                                    data,
                                    createdBoothTemplate,
                                    boothTemplatePositionRepository,
                                );
                            return boothTemplatePosition;
                        },
                    ),
                );
                createdBoothTemplate.boothTemplatePositions =
                    boothTemplatePosition;

                return createdBoothTemplate;
            },
        );

        return this.boothTemplateConverter.toDto(createdBoothTemplate);
    }

    private async createBoothTemplatePosition(
        boothTemplatePositionDto: BoothTemplatePositionDto,
        boothTemplateEntity: BoothTemplate,
        boothTemplatePositionRepository: Repository<BoothTemplatePosition>,
    ): Promise<BoothTemplatePosition> {
        const boothTemplatePositionEntity =
            this.boothTemplatePositionConverter.toEntity(
                boothTemplatePositionDto,
            );

        boothTemplatePositionEntity.boothTemplate = boothTemplateEntity;

        const createdBoothTemplatePosition =
            await boothTemplatePositionRepository.save(
                boothTemplatePositionEntity,
            );

        return createdBoothTemplatePosition;
    }

    async deleteBoothTemplate(id: string) {
        await this.dataSource.transaction(async (manager) => {
            const boothTemplateRepository =
                manager.getRepository(BoothTemplate);

            const firstBoothTemplate = await boothTemplateRepository.findOneBy({
                id: parseInt(id),
            });

            if (!firstBoothTemplate) {
                throw new NotFoundException('Not found');
            }

            await boothTemplateRepository.softRemove(firstBoothTemplate);
        });
    }
}
