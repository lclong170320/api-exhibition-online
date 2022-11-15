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
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SpaceTemplateListConverter } from '../converters/space-template-list.converter';
import { SpaceTemplate as SpaceTemplateDto } from '@/components/exhibition/dto/space-template.dto';
import { SpaceTemplatePosition as SpaceTemplatePositionDto } from '@/components/exhibition/dto/space-template-position.dto';
import { SpaceTemplateLocation as SpaceTemplateLocationDto } from '@/components/exhibition/dto/space-template-location.dto';
import { SpaceTemplateLocation } from '../entities/space-template-location.entity';
import { SpaceTemplatePosition } from '../entities/space-template-position.entity';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { SpaceTemplateLocationConverter } from '../converters/space-template-location.converter';

@Injectable()
export class SpaceTemplateService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private spaceTemplateConverter: SpaceTemplateConverter,
        private spaceTemplateListConverter: SpaceTemplateListConverter,
        private spaceTemplateLocationConverter: SpaceTemplateLocationConverter,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    async findSpaceTemplateById(id: string, populate: string[]) {
        const spaceTemplateRepository =
            this.dataSource.manager.getRepository(SpaceTemplate);
        const populatableColumns = [
            'spaces',
            'spaceTemplatePositions',
            'spaceTemplateLocations',
        ];
        populate.forEach((value) => {
            if (!populatableColumns.includes(value)) {
                throw new BadRequestException(
                    'Query value is not allowed ' + value,
                );
            }
        });
        const firstSpaceTemplate = await spaceTemplateRepository.findOne({
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
            },
        );

        return this.spaceTemplateListConverter.toDto(
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

    private async createUrlMedias(data: string): Promise<number> {
        const requestConfig = {
            maxBodyLength: Infinity,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const url = this.configService.get('CREATING_MEDIA_URL');
        const media = this.httpService.post(url, { data }, requestConfig);
        const response = media.pipe(
            map((res) => {
                return res.data;
            }),
        );
        const result = await lastValueFrom(response);

        return result.id;
    }

    async createSpaceTemplate(spaceTemplateDto: SpaceTemplateDto) {
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
                spaceTemplateEntity.createdDate = new Date(
                    spaceTemplateDto.created_date,
                );
                spaceTemplateEntity.createdBy = 1; // TODO: handle getUserId from access token

                spaceTemplateEntity.thumbnailId = await this.createUrlMedias(
                    spaceTemplateDto.thumbnail_data,
                );
                spaceTemplateEntity.modelId = await this.createUrlMedias(
                    spaceTemplateDto.model_data,
                );
                spaceTemplateEntity.mapId = await this.createUrlMedias(
                    spaceTemplateDto.map_data,
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
}
