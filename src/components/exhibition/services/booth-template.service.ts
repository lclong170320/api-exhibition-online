import { DbConnection } from '@/database/config/db';
import {
    NotFoundException,
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { BoothTemplateListConverter } from '@/components/exhibition/converters/booth-template-list.converter';
import { BoothTemplateConverter } from '@/components/exhibition/converters/booth-template.converter';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { DataSource } from 'typeorm';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';
import { BoothOrganizationTemplate } from '../entities/booth-organization-template.entity';
import { BoothOrganizationTemplateConverter } from '../converters/booth-organization-template.converter';
import { BoothTemplate as BoothTemplateDto } from '@/components/exhibition/dto/booth-template.dto';
import { BoothTemplatePosition as BoothTemplatePositionDto } from '@/components/exhibition/dto/booth-template-position.dto';

import { BoothTemplatePosition } from '../entities/booth-template-position.entity';
import { BoothTemplatePositionConverter } from '../converters/booth-template-position.converter';

@Injectable()
export class BoothTemplateService {
    constructor(
        @InjectRepository(BoothTemplate, DbConnection.exhibitionCon)
        private readonly boothTemplateRepository: Repository<BoothTemplate>,
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private boothTemplateListConverter: BoothTemplateListConverter,
        private boothTemplateConverter: BoothTemplateConverter,
        private boothTemplatePositionConverter: BoothTemplatePositionConverter,
        private boothOrganizationTemplateConverter: BoothOrganizationTemplateConverter,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async findBoothTemplateById(id: string, populate: string[]) {
        const allowPopulate = ['boothTemplatePositions'];

        populate.forEach((value) => {
            if (!allowPopulate.includes(value)) {
                throw new BadRequestException(
                    'Query value is not allowed ' + value,
                );
            }
        });
        const firstBoothTemplate = await this.boothTemplateRepository.findOne({
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

    async findBoothTemplates(query: PaginateQuery) {
        const sortableColumns = ['id', 'name', 'type', 'createdAt'];
        const searchableColumns = ['name'];
        const filterableColumns = ['type'];
        const defaultSortBy = [['createdAt', 'DESC']];
        const populatableColumns = ['boothTemplatePositions'];
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

        return this.boothTemplateListConverter.toDto(
            query.page,
            query.limit,
            total,
            boothTemplates,
        );
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

    async createBoothTemplate(
        boothTemplateDto: BoothTemplateDto,
    ): Promise<BoothTemplateDto> {
        const createdBoothTemplate = await this.dataSource.transaction(
            async (manager) => {
                const boothTemplateRepository =
                    manager.getRepository(BoothTemplate);
                const boothTemplatePositionRepository = manager.getRepository(
                    BoothTemplatePosition,
                );

                const created_by = 1; // TODO: handle getUserId from access token
                const boothTemplateEntity =
                    this.boothTemplateConverter.toEntity(boothTemplateDto);
                boothTemplateEntity.modelId = await this.createUrlMedias(
                    boothTemplateDto.model_data,
                );

                boothTemplateEntity.thumbnailId = await this.createUrlMedias(
                    boothTemplateDto.thumbnail_data,
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
}
