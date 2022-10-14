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
import { BoothTemplate as BoothTemplateDto } from '@/components/exhibition/dto/booth-template.dto';
import { DataSource } from 'typeorm';
import { PositionBooth } from '../entities/position-booth.entity';
import { PositionBoothConverter } from '../converters/position-booth.converter';
import { PositionBooth as PositionBoothDto } from '@/components/exhibition/dto/position-booth.dto';

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
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private positionBoothConverter: PositionBoothConverter,
    ) {}

    async findBoothTemplateById(id: string) {
        const firstBoothTemplate = await this.boothTemplateRepository.findOneBy(
            {
                id: parseInt(id),
            },
        );

        if (!firstBoothTemplate) {
            throw new NotFoundException(`The 'booth_id' ${id} is not found`);
        }

        return this.boothTemplateConverter.toDto(firstBoothTemplate);
    }

    async findBoothTemplates(offset: string, limit: string) {
        const offsetQuery = parseInt(offset)
            ? parseInt(offset)
            : this.offsetDefault;
        const limitQuery = parseInt(limit)
            ? parseInt(limit)
            : this.limitDefault;

        const [boothTemplateEntity, count] =
            await this.boothTemplateRepository.findAndCount({
                order: {
                    createdAt: 'DESC',
                },
                skip: offsetQuery,
                take: limitQuery,
            });

        return this.boothTemplateListConverter.toDto(
            boothTemplateEntity,
            limitQuery,
            offsetQuery,
            count,
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
        const allowExtension = this.configService
            .get<string>('TYPE_BOOTH_TEMPLATE')
            .split(',');
        boothTemplateDto.position_booths.map((item) => {
            if (!allowExtension.includes(item.type)) {
                throw new BadRequestException(
                    'Not allowed extension: ' + item.type,
                );
            }
        });

        const createdBoothTemplate = await this.dataSource.transaction(
            async (manager) => {
                const boothTemplateRepository =
                    manager.getRepository(BoothTemplate);
                const positionBoothRepository =
                    manager.getRepository(PositionBooth);

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

                const positionBooths = await Promise.all(
                    boothTemplateDto.position_booths.map(async (data) => {
                        const positionBooth = await this.createPositionBooth(
                            data,
                            createdBoothTemplate,
                            positionBoothRepository,
                        );
                        return positionBooth;
                    }),
                );
                createdBoothTemplate.positionBooth = positionBooths;

                return createdBoothTemplate;
            },
        );

        return this.boothTemplateConverter.toDto(createdBoothTemplate);
    }

    private async createPositionBooth(
        positionBoothDto: PositionBoothDto,
        boothTemplateEntity: BoothTemplate,
        positionBoothRepository: Repository<PositionBooth>,
    ): Promise<PositionBooth> {
        const positionBoothEntity =
            this.positionBoothConverter.toEntity(positionBoothDto);

        positionBoothEntity.boothTemplate = boothTemplateEntity;

        const createdPositionBooth = await positionBoothRepository.save(
            positionBoothEntity,
        );

        return createdPositionBooth;
    }
}
