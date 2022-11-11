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
import { paginate, FilterOperator } from 'nestjs-paginate';
import { BoothOrganizationTemplate } from '../entities/booth-organization-template.entity';
import { BoothOrganizationTemplateConverter } from '../converters/booth-organization-template.converter';

@Injectable()
export class BoothTemplateService {
    private readonly offsetDefault = 0;
    private readonly limitDefault = 10;
    constructor(
        @InjectRepository(BoothTemplate, DbConnection.exhibitionCon)
        private readonly boothTemplateRepository: Repository<BoothTemplate>,
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private boothTemplateListConverter: BoothTemplateListConverter,
        private boothTemplateConverter: BoothTemplateConverter,
        private boothOrganizationTemplateConverter: BoothOrganizationTemplateConverter,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async findBoothTemplateById(id: string, populate: string[]) {
        const allowPopulate = ['positionBooths', 'boothOrganizations'];

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
        const boothTemplates = await paginate(
            query,
            this.boothTemplateRepository,
            {
                maxLimit: query.limit,
                defaultLimit: this.limitDefault,
                sortableColumns: ['id', 'name', 'type', 'createdAt'],
                defaultSortBy: [['createdAt', 'DESC']],
                searchableColumns: ['id', 'name', 'type', 'createdDate'],
                filterableColumns: {
                    type: [FilterOperator.EQ, FilterOperator.IN],
                },
            },
        );

        return this.boothTemplateListConverter.toDto(
            boothTemplates.meta.currentPage,
            boothTemplates.meta.itemsPerPage,
            boothTemplates.meta.totalItems,
            boothTemplates.data,
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

    // async createBoothTemplate(
    //     boothTemplateDto: BoothTemplateDto,
    // ): Promise<BoothTemplateDto> {
    //     const allowExtension = this.configService
    //         .get<string>('TYPE_BOOTH_TEMPLATE')
    //         .split(',');
    //     boothTemplateDto.position_booths.map((item) => {
    //         if (!allowExtension.includes(item.type)) {
    //             throw new BadRequestException(
    //                 'Not allowed extension: ' + item.type,
    //             );
    //         }
    //     });

    //     // const createdBoothTemplate = await this.dataSource.transaction(
    //     //     async (manager) => {
    //     //         const boothTemplateRepository =
    //     //             manager.getRepository(BoothTemplate);
    //     //         const positionBoothRepository = manager.getRepository(
    //     //             BoothOrganizationTemplatePosition,
    //     //         );

    //     //         const created_by = 1; // TODO: handle getUserId from access token
    //     //         const boothTemplateEntity =
    //     //             this.boothTemplateConverter.toEntity(boothTemplateDto);
    //     //         boothTemplateEntity.modelId = await this.createUrlMedias(
    //     //             boothTemplateDto.model_data,
    //     //         );

    //     //         boothTemplateEntity.thumbnailId = await this.createUrlMedias(
    //     //             boothTemplateDto.thumbnail_data,
    //     //         );
    //     //         boothTemplateEntity.createdBy = created_by;
    //     //         boothTemplateEntity.createdDate = new Date();
    //     //         const createdBoothTemplate = await boothTemplateRepository.save(
    //     //             boothTemplateEntity,
    //     //         );

    //     //         const positionBooths = await Promise.all(
    //     //             boothTemplateDto.position_booths.map(async (data) => {
    //     //                 const positionBooth = await this.createPositionBooth(
    //     //                     data,
    //     //                     createdBoothTemplate,
    //     //                     positionBoothRepository,
    //     //                 );
    //     //                 return positionBooth;
    //     //             }),
    //     //         );
    //     //         createdBoothTemplate.boothTemplatePositions = positionBooths;

    //     //         return createdBoothTemplate;
    //     //     },
    //     // );

    // //     return this.boothTemplateConverter.toDto(createdBoothTemplate);
    // // }

    // private async createPositionBooth(
    //     positionBoothDto: PositionBoothDto,
    //     boothTemplateEntity: BoothTemplate,
    //     boothOrganizationTemplatePositionRepository: Repository<BoothOrganizationTemplatePosition>,
    // ): Promise<BoothOrganizationTemplatePosition> {
    //     const positionBoothEntity =
    //         this.positionBoothConverter.toEntity(positionBoothDto);

    //     positionBoothEntity.boothTemplate = boothTemplateEntity;

    //     const createdPositionBooth =
    //         await boothOrganizationTemplatePositionRepository.save(
    //             positionBoothEntity,
    //         );

    //     return createdPositionBooth;
    // }

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
