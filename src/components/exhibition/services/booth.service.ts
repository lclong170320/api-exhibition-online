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
import { BoothDataConverter } from '@/components/exhibition/converters/booth-data.converter';
import { BoothConverter } from '@/components/exhibition/converters/booth.converter';
import { Booth as BoothDto } from '@/components/exhibition/dto/booth.dto';
import { BoothData as BoothDataDto } from '@/components/exhibition/dto/booth-data.dto';
import { BoothData } from '@/components/exhibition/entities/booth-data.entity';
import { Booth } from '@/components/exhibition/entities/booth.entity';
import { PositionBooth } from '@/components/exhibition/entities/position-booth.entity';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BoothService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private boothConverter: BoothConverter,
        private boothDataConverter: BoothDataConverter,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async getBoothById(boothId: string) {
        const boothRepository = this.dataSource.getRepository(Booth);
        const firstBooth = await boothRepository.findOne({
            where: {
                id: parseInt(boothId),
            },
            relations: [
                'boothDatas',
                'boothTemplate',
                'boothDatas.positionBooth',
            ],
        });

        if (!firstBooth) {
            throw new NotFoundException(
                `The 'booth_id' ${boothId} is not found`,
            );
        }
        return this.boothConverter.toDto(firstBooth);
    }

    async updateBooth(boothId: string, boothDto: BoothDto): Promise<BoothDto> {
        const updatedBooth = await this.dataSource.transaction(
            async (manager) => {
                const boothRepository = manager.getRepository(Booth);
                const boothDataRepository = manager.getRepository(BoothData);
                const boothTemplateRepository =
                    manager.getRepository(BoothTemplate);
                const positionBoothRepository =
                    manager.getRepository(PositionBooth);

                let boothEntity = await boothRepository.findOne({
                    where: {
                        id: parseInt(boothId),
                    },
                    relations: ['boothDatas', 'boothTemplate'],
                });

                if (!boothEntity) {
                    throw new NotFoundException(
                        `The 'booth_id' ${boothId} is not found`,
                    );
                }

                const boothTemplate = boothTemplateRepository.findOneBy({
                    id: boothDto.booth_template_id,
                });

                if (!boothTemplate) {
                    throw new BadRequestException(
                        "The 'booth_template_id' is not found ",
                    );
                }

                boothEntity = await this.removeAllOldBoothData(
                    boothEntity,
                    boothDataRepository,
                );

                boothEntity = await this.createBoothDatas(
                    boothDto,
                    boothEntity,
                    boothDataRepository,
                    positionBoothRepository,
                );

                return boothEntity;
            },
        );
        return this.boothConverter.toDto(updatedBooth);
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

    private async removeAllOldBoothData(
        booth: Booth,
        boothDataRepository: Repository<BoothData>,
    ) {
        await boothDataRepository.remove(booth.boothDatas);
        booth.boothDatas = [];
        return booth;
    }

    private async createBoothData(
        data: BoothDataDto,
        booth: Booth,
        boothDataRepository: Repository<BoothData>,
        positionBoothRepository: Repository<PositionBooth>,
    ) {
        const boothDataEntity = this.boothDataConverter.toEntity(data);

        boothDataEntity.mediaId = data.selected_media_id;

        if (data.media_data) {
            boothDataEntity.mediaId = await this.createUrlMedias(
                data.media_data,
            );
        }

        boothDataEntity.booth = booth;

        const positionTemplateEntity = await positionBoothRepository.findOneBy({
            id: data.position_booth_id,
        });

        if (!positionTemplateEntity) {
            throw new BadRequestException(
                'The "position_template_id" not found: ' +
                    data.position_booth_id,
            );
        }

        boothDataEntity.positionBooth = positionTemplateEntity;

        const createBoothData = await boothDataRepository.save(boothDataEntity);

        return createBoothData;
    }

    private async createBoothDatas(
        boothDto: BoothDto,
        booth: Booth,
        boothDataRepository: Repository<BoothData>,
        positionBoothRepository: Repository<PositionBooth>,
    ) {
        const newBoothDatas = await Promise.all(
            boothDto.boothDatas.map(async (data) => {
                const newBoothData = await this.createBoothData(
                    data,
                    booth,
                    boothDataRepository,
                    positionBoothRepository,
                );
                return newBoothData;
            }),
        );

        booth.boothDatas = newBoothDatas;
        return booth;
    }
}
