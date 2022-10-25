import { DbConnection } from '@/database/config/db';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import {
    NotFoundException,
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import { Space as SpaceDto } from '@/components/exhibition/dto/space.dto';
import { SpaceData as SpaceDataDto } from '@/components/exhibition/dto/space-data.dto';
import { Space } from '@/components/exhibition/entities/space.entity';
import { SpaceData } from '@/components/exhibition/entities/space-data.entity';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';
import { PositionSpace } from '@/components/exhibition/entities/position-space.entity';
import { SpaceConverter } from '@/components/exhibition/converters/space.converter';
import { HttpService } from '@nestjs/axios';
import { SpaceDataConverter } from '@/components/exhibition/converters/space-data.converter';

@Injectable()
export class SpaceService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly spaceConverter: SpaceConverter,
        private readonly spaceDataConverter: SpaceDataConverter,
    ) {}

    async getSpaceById(spaceId: string, populate: string[]) {
        const allowPopulate = [
            'spaceDatas',
            'spaceDatas.positionSpace',
            'spaceTemplate',
        ];

        populate &&
            populate.forEach((value) => {
                if (!allowPopulate.includes(value)) {
                    throw new BadRequestException('Query value is not allowed');
                }
            });

        const spaceRepository = this.dataSource.getRepository(Space);
        const firstSpace = await spaceRepository.findOne({
            where: {
                id: parseInt(spaceId),
            },
            relations: populate,
        });

        if (!firstSpace) {
            throw new NotFoundException(
                `The 'space_id' ${spaceId} is not found`,
            );
        }
        return this.spaceConverter.toDto(firstSpace);
    }

    async updateSpace(spaceId: string, spaceDto: SpaceDto) {
        const updatedSpace = await this.dataSource.transaction(
            async (manager) => {
                const spaceRepository = manager.getRepository(Space);
                const spaceDataRepository = manager.getRepository(SpaceData);
                const positionSpaceRepository =
                    manager.getRepository(PositionSpace);
                const spaceTemplateRepository =
                    manager.getRepository(SpaceTemplate);

                let spaceEntity = await spaceRepository.findOne({
                    where: {
                        id: parseInt(spaceId),
                    },
                    relations: ['spaceDatas', 'spaceTemplate'],
                });

                if (!spaceEntity) {
                    throw new NotFoundException(
                        `The 'space_id' ${spaceId} is not found`,
                    );
                }

                const spaceTemplate = await spaceTemplateRepository.findOneBy({
                    id: spaceDto.space_template_id,
                });

                if (!spaceTemplate) {
                    throw new BadRequestException(
                        "The 'space_template_id' is not found ",
                    );
                }

                spaceEntity = await this.removeOldSpaceData(
                    spaceEntity,
                    spaceDataRepository,
                );

                spaceEntity = await this.createSpaceDatas(
                    spaceDto,
                    spaceEntity,
                    spaceDataRepository,
                    positionSpaceRepository,
                );

                return spaceEntity;
            },
        );

        return this.spaceConverter.toDto(updatedSpace);
    }

    private async removeOldSpaceData(
        space: Space,
        spaceDataRepository: Repository<SpaceData>,
    ) {
        await spaceDataRepository.remove(space.spaceDatas);
        space.spaceDatas = [];
        return space;
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

    private async createSpaceData(
        data: SpaceDataDto,
        space: Space,
        spaceDataRepository: Repository<SpaceData>,
        positionSpaceRepository: Repository<PositionSpace>,
    ) {
        const spaceDataEntity = this.spaceDataConverter.toEntity(data);

        spaceDataEntity.mediaId = data.selected_media_id;

        if (data.media_data) {
            spaceDataEntity.mediaId = await this.createUrlMedias(
                data.media_data,
            );
        }

        spaceDataEntity.space = space;

        const positionSpaceEntity = await positionSpaceRepository.findOneBy({
            id: data.position_space_id,
        });

        if (!positionSpaceEntity) {
            throw new BadRequestException(
                'The "position_space_id" not found: ' + data.position_space_id,
            );
        }

        spaceDataEntity.positionSpace = positionSpaceEntity;

        const createSpaceData = await spaceDataRepository.save(spaceDataEntity);

        return createSpaceData;
    }

    private async createSpaceDatas(
        spaceDto: SpaceDto,
        space: Space,
        spaceDataRepository: Repository<SpaceData>,
        positionSpaceRepository: Repository<PositionSpace>,
    ) {
        const newSpaceDatas = await Promise.all(
            spaceDto.space_datas.map(async (data) => {
                const newSpaceData = await this.createSpaceData(
                    data,
                    space,
                    spaceDataRepository,
                    positionSpaceRepository,
                );
                return newSpaceData;
            }),
        );

        space.spaceDatas = newSpaceDatas;
        return space;
    }
}
