import { SpaceTemplateConverter } from '@/components/exhibition/converters/space-template.converter';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';
import { DbConnection } from '@/database/config/db';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginatedSpaceTemplatesConverter } from '../converters/paginated-space-templates.converter';
import { SpaceTemplate as SpaceTemplateDto } from '@/components/exhibition/dto/space-template.dto';
import { SpaceTemplatePosition as SpaceTemplatePositionDto } from '@/components/exhibition/dto/space-template-position.dto';
import { SpaceTemplateLocation as SpaceTemplateLocationDto } from '@/components/exhibition/dto/space-template-location.dto';
import { SpaceTemplateLocation } from '../entities/space-template-location.entity';
import { SpaceTemplatePosition } from '../entities/space-template-position.entity';
import { SpaceTemplateLocationConverter } from '../converters/space-template-location.converter';
import { User } from '@/components/exhibition/dto/user.dto';
import { MediaClientService } from 'clients/media.client';

@Injectable()
export class SpaceTemplateService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private spaceTemplateConverter: SpaceTemplateConverter,
        private paginatedSpaceTemplatesConverter: PaginatedSpaceTemplatesConverter,
        private spaceTemplateLocationConverter: SpaceTemplateLocationConverter,
        private readonly mediaClientService: MediaClientService,
    ) {}

    async readSpaceTemplateById(id: string, query: PaginateQuery) {
        const spaceTemplateRepository =
            this.dataSource.manager.getRepository(SpaceTemplate);
        const firstSpaceTemplate = await spaceTemplateRepository.findOne({
            where: {
                id: parseInt(id),
            },
            relations: query.populate,
            withDeleted: query.withDeleted,
        });

        if (!firstSpaceTemplate) {
            throw new NotFoundException(`The 'space_id' ${id} is not found`);
        }

        return this.spaceTemplateConverter.toDto(firstSpaceTemplate);
    }

    async readSpaceTemplates(query: PaginateQuery) {
        const spaceTemplateRepository =
            this.dataSource.manager.getRepository(SpaceTemplate);
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
            spaceTemplateRepository,
            {
                sortableColumns,
                defaultSortBy,
                searchableColumns,
                populatableColumns,
                withDeleted: query.withDeleted,
            },
        );

        return this.paginatedSpaceTemplatesConverter.toDto(
            query.page,
            query.limit,
            total,
            spaceTemplates,
        );
    }

    private async createSpaceTemplatePositions(
        listOfSpaceTemplatePositionDto: SpaceTemplatePositionDto[],
        spaceTemplate: SpaceTemplate,
        spaceTemplatePositionRepository: Repository<SpaceTemplatePosition>,
    ) {
        const createdSpaceTemplatePositions = await Promise.all(
            listOfSpaceTemplatePositionDto.map(
                async (spaceTemplatePositionDto) => {
                    const spaceTemplatePositionEntity =
                        new SpaceTemplatePosition();

                    spaceTemplatePositionEntity.position =
                        spaceTemplatePositionDto.position;
                    spaceTemplatePositionEntity.type =
                        spaceTemplatePositionDto.type;
                    spaceTemplatePositionEntity.spaceTemplate = spaceTemplate;

                    const cratedSpaceTemplatePosition =
                        await spaceTemplatePositionRepository.save(
                            spaceTemplatePositionEntity,
                        );

                    return cratedSpaceTemplatePosition;
                },
            ),
        );

        return createdSpaceTemplatePositions;
    }

    private async createSpaceTemplateLocations(
        listOfSpaceTemplateLocationDto: SpaceTemplateLocationDto[],
        spaceTemplate: SpaceTemplate,
        spaceTemplateLocationRepository: Repository<SpaceTemplateLocation>,
    ) {
        const createdSpaceTemplateLocations = await Promise.all(
            listOfSpaceTemplateLocationDto.map(
                async (spaceTemplateLocationDto) => {
                    const spaceTemplateLocationEntity =
                        this.spaceTemplateLocationConverter.toEntity(
                            spaceTemplateLocationDto,
                        );
                    spaceTemplateLocationEntity.spaceTemplate = spaceTemplate;

                    const createdSpaceTemplateLocation =
                        await spaceTemplateLocationRepository.save(
                            spaceTemplateLocationEntity,
                        );

                    return createdSpaceTemplateLocation;
                },
            ),
        );

        return createdSpaceTemplateLocations;
    }

    async createSpaceTemplate(
        jwtAccessToken: string,
        user: User,
        spaceTemplateDto: SpaceTemplateDto,
    ) {
        const createdSpaceTemplate = await this.dataSource.transaction(
            async (manager) => {
                const spaceTemplateRepository =
                    manager.getRepository(SpaceTemplate);
                const spaceTemplateLocationRepository = manager.getRepository(
                    SpaceTemplateLocation,
                );
                const spaceTemplatePositionRepository = manager.getRepository(
                    SpaceTemplatePosition,
                );

                const spaceTemplateEntity = new SpaceTemplate();
                spaceTemplateEntity.name = spaceTemplateDto.name;
                spaceTemplateEntity.createdDate = new Date();
                spaceTemplateEntity.createdBy = user.id;

                spaceTemplateEntity.thumbnailId =
                    await this.mediaClientService.createUrlMedias(
                        spaceTemplateDto.thumbnail_data,
                        jwtAccessToken,
                    );
                spaceTemplateEntity.modelId =
                    await this.mediaClientService.createUrlMedias(
                        spaceTemplateDto.model_data,
                        jwtAccessToken,
                    );
                spaceTemplateEntity.mapId =
                    await this.mediaClientService.createUrlMedias(
                        spaceTemplateDto.map_data,
                        jwtAccessToken,
                    );
                const createdSpaceTemplate = await spaceTemplateRepository.save(
                    spaceTemplateEntity,
                );

                await this.createSpaceTemplatePositions(
                    spaceTemplateDto.space_template_positions,
                    createdSpaceTemplate,
                    spaceTemplatePositionRepository,
                );

                await this.createSpaceTemplateLocations(
                    spaceTemplateDto.space_template_locations,
                    createdSpaceTemplate,
                    spaceTemplateLocationRepository,
                );

                return createdSpaceTemplate;
            },
        );

        return this.spaceTemplateConverter.toDto(createdSpaceTemplate);
    }

    async deleteSpaceTemplate(id: string) {
        await this.dataSource.transaction(async (manager) => {
            const spaceTemplateRepository =
                manager.getRepository(SpaceTemplate);

            const firstSpaceTemplate = await spaceTemplateRepository.findOneBy({
                id: parseInt(id),
            });

            if (!firstSpaceTemplate) {
                throw new NotFoundException('Not found');
            }

            await spaceTemplateRepository.softRemove(firstSpaceTemplate);
        });
    }
}
