import { DbConnection } from '@/database/config/db';
import { HttpService } from '@nestjs/axios';
import {
    BadRequestException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { lastValueFrom, map } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { BoothOrganizationDataConverter } from '@/components/exhibition/converters/booth-organization-data.converter';
import { BoothOrganizationConverter } from '@/components/exhibition/converters/booth-organization.converter';
import { BoothOrganization as BoothOrganizationDto } from '@/components/exhibition/dto/booth-organization.dto';
import { BoothOrganizationData as BoothOrganizationDataDto } from '@/components/exhibition/dto/booth-organization-data.dto';
import { BoothOrganizationData } from '@/components/exhibition/entities/booth-organization-data.entity';
import { BoothOrganization } from '@/components/exhibition/entities/booth-organization.entity';
import { PositionBooth } from '@/components/exhibition/entities/position-booth.entity';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BoothOrganizationService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly boothOrganizationConverter: BoothOrganizationConverter,
        private readonly boothOrganizationDataConverter: BoothOrganizationDataConverter,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async getBoothOrganizationById(
        boothOrganizationId: string,
        populate: string[],
    ) {
        const allowPopulate = [
            'boothOrganizationData',
            'boothTemplate',
            'boothOrganizationData.positionBooth',
        ];

        populate.forEach((value) => {
            if (!allowPopulate.includes(value)) {
                throw new BadRequestException(
                    'Query value is not allowed ' + value,
                );
            }
        });

        const boothOrganizationRepository =
            this.dataSource.getRepository(BoothOrganization);
        const firstBooth = await boothOrganizationRepository.findOne({
            where: {
                id: parseInt(boothOrganizationId),
            },
            relations: populate,
        });

        if (!firstBooth) {
            throw new NotFoundException(
                `The 'booth_id' ${boothOrganizationId} is not found`,
            );
        }
        return this.boothOrganizationConverter.toDto(firstBooth);
    }

    async updateBoothOrganization(
        boothOrganizationId: string,
        boothOrganizationDto: BoothOrganizationDto,
    ): Promise<BoothOrganizationDto> {
        const updatedBooth = await this.dataSource.transaction(
            async (manager) => {
                const boothOrganizationRepository =
                    manager.getRepository(BoothOrganization);
                const boothOrganizationDataRepository = manager.getRepository(
                    BoothOrganizationData,
                );
                const boothTemplateRepository =
                    manager.getRepository(BoothTemplate);
                const positionBoothRepository =
                    manager.getRepository(PositionBooth);

                let boothOrganizationEntity =
                    await boothOrganizationRepository.findOne({
                        where: {
                            id: parseInt(boothOrganizationId),
                        },
                        relations: [
                            'boothOrganizationData',
                            'boothTemplate',
                            'boothOrganizationData.positionBooth',
                        ],
                    });

                if (!boothOrganizationEntity) {
                    throw new NotFoundException(
                        `The 'booth_id' ${boothOrganizationId} is not found`,
                    );
                }

                const boothTemplate = boothTemplateRepository.findOneBy({
                    id: boothOrganizationDto.booth_template_id,
                });

                if (!boothTemplate) {
                    throw new BadRequestException(
                        "The 'booth_template_id' is not found ",
                    );
                }

                boothOrganizationEntity =
                    await this.removeAllOldBoothOrganizationData(
                        boothOrganizationEntity,
                        boothOrganizationDataRepository,
                    );

                boothOrganizationEntity =
                    await this.createMultipleBoothOrganizationData(
                        boothOrganizationDto,
                        boothOrganizationEntity,
                        boothOrganizationDataRepository,
                        positionBoothRepository,
                    );

                return boothOrganizationEntity;
            },
        );
        return this.boothOrganizationConverter.toDto(updatedBooth);
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

    private async removeAllOldBoothOrganizationData(
        boothOrganization: BoothOrganization,
        boothOrganizationDataRepository: Repository<BoothOrganizationData>,
    ) {
        await boothOrganizationDataRepository.remove(
            boothOrganization.boothOrganizationData,
        );
        boothOrganization.boothOrganizationData = [];
        return boothOrganization;
    }

    private async createBoothOrganizationData(
        data: BoothOrganizationDataDto,
        boothOrganization: BoothOrganization,
        BoothOrganizatiobDataRepository: Repository<BoothOrganizationData>,
        positionBoothRepository: Repository<PositionBooth>,
    ) {
        const boothOrganizationDataEntity =
            this.boothOrganizationDataConverter.toEntity(data);

        boothOrganizationDataEntity.mediaId = data.selected_media_id;

        if (data.media_data) {
            boothOrganizationDataEntity.mediaId = await this.createUrlMedias(
                data.media_data,
            );
        }

        boothOrganizationDataEntity.boothOrganization = boothOrganization;

        const positionTemplateEntity = await positionBoothRepository.findOneBy({
            id: data.position_booth_id,
        });

        if (!positionTemplateEntity) {
            throw new BadRequestException(
                'The "position_template_id" not found: ' +
                    data.position_booth_id,
            );
        }

        boothOrganizationDataEntity.positionBooth = positionTemplateEntity;

        const createBoothData = await BoothOrganizatiobDataRepository.save(
            boothOrganizationDataEntity,
        );

        return createBoothData;
    }

    private async createMultipleBoothOrganizationData(
        boothOrganizationDto: BoothOrganizationDto,
        boothOrganization: BoothOrganization,
        boothOrganizationDataRepository: Repository<BoothOrganizationData>,
        positionBoothRepository: Repository<PositionBooth>,
    ) {
        const newBoothDatas = await Promise.all(
            boothOrganizationDto.booth_organization_data.map(async (data) => {
                const newBoothData = await this.createBoothOrganizationData(
                    data,
                    boothOrganization,
                    boothOrganizationDataRepository,
                    positionBoothRepository,
                );
                return newBoothData;
            }),
        );

        boothOrganization.boothOrganizationData = newBoothDatas;
        return boothOrganization;
    }
}
