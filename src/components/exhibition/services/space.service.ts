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
import { Space } from '@/components/exhibition/entities/space.entity';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';
import { SpaceConverter } from '@/components/exhibition/converters/space.converter';
import { HttpService } from '@nestjs/axios';
import { SpaceTemplatePosition } from '../entities/space-template-position.entity';
import { SpaceImage } from '../entities/space-image.entity';
import { SpaceVideo } from '../entities/space-video.entity';
import { SpaceImage as SpaceImageDto } from '../dto/space-image.dto';
import { SpaceVideo as SpaceVideoDto } from '../dto/space-video.dto';
import { SpaceVideoConverter } from '../converters/space-video.converter';
import { SpaceImageConverter } from '../converters/space-image.converter';
import { Video } from '../entities/video.entity';
import { Image } from '../entities/image.entity';
import { Location } from '../entities/location.entity';
import { Location as LocationDto } from '../dto/location.dto';
import { SpaceTemplateLocation } from '../entities/space-template-location.entity';
import { LocationConverter } from '../converters/location.converter';

@Injectable()
export class SpaceService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly spaceConverter: SpaceConverter,
        private readonly spaceVideoConverter: SpaceVideoConverter,
        private readonly spaceImageConverter: SpaceImageConverter,
        private readonly locationConverter: LocationConverter,
    ) {}

    async getSpaceById(spaceId: string, populate: string[]) {
        const allowPopulate = [
            'exhibition',
            'spaceImages',
            'spaceVideos',
            'spaceTemplate',
            'spaceTemplate.spaceTemplatePositions',
            'spaceImages.image',
            'spaceImages.spaceTemplatePosition',
            'spaceVideos.video',
            'spaceVideos.spaceTemplatePosition',
        ];

        populate.forEach((value) => {
            if (!allowPopulate.includes(value)) {
                throw new BadRequestException(
                    'Query value is not allowed ' + value,
                );
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
                const spaceImageRepository = manager.getRepository(SpaceImage);
                const spaceVideoRepository = manager.getRepository(SpaceVideo);
                const spaceTemplatePositionRepository = manager.getRepository(
                    SpaceTemplatePosition,
                );
                const spaceTemplateLocationRepository = manager.getRepository(
                    SpaceTemplateLocation,
                );
                const spaceTemplateRepository =
                    manager.getRepository(SpaceTemplate);
                const locationRepository = manager.getRepository(Location);
                let spaceEntity = await spaceRepository.findOne({
                    where: {
                        id: parseInt(spaceId),
                    },
                    relations: ['exhibition'],
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
                    spaceImageRepository,
                    spaceVideoRepository,
                );
                await this.createSpaceData(
                    spaceDto,
                    spaceEntity,
                    spaceImageRepository,
                    spaceVideoRepository,
                    spaceTemplatePositionRepository,
                    spaceTemplateLocationRepository,
                    locationRepository,
                );
                return spaceEntity;
            },
        );

        return this.spaceConverter.toDto(updatedSpace);
    }

    private async removeOldSpaceData(
        space: Space,
        spaceImageRepository: Repository<SpaceImage>,
        spaceVideoRepository: Repository<SpaceVideo>,
    ) {
        const spaceImages = await spaceImageRepository.find({
            where: {
                space: {
                    id: space.id,
                },
            },
        });
        await spaceImageRepository.remove(spaceImages);
        const spaceVideos = await spaceVideoRepository.find({
            where: {
                space: {
                    id: space.id,
                },
            },
        });

        await spaceVideoRepository.remove(spaceVideos);
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

    private async createSpaceVideo(
        data: SpaceVideoDto,
        space: Space,
        spaceVideoRepository: Repository<SpaceVideo>,
        spaceTemplatePositionRepository: Repository<SpaceTemplatePosition>,
    ) {
        const videoRepository = this.dataSource.getRepository(Video);
        const spaceVideoEntity = this.spaceVideoConverter.toEntity(data);
        const video = await videoRepository.findOneBy({
            id: data.select_media_id,
        });
        spaceVideoEntity.video = video;

        if (data.media_data) {
            const newVideoId = await this.createUrlMedias(data.media_data);
            const newVideo = await videoRepository.findOneBy({
                id: newVideoId,
            });
            spaceVideoEntity.video = newVideo;
        }
        spaceVideoEntity.space = space;
        const spaceTemplatePosition =
            await spaceTemplatePositionRepository.findOneBy({
                id: data.space_template_position_id,
            });

        if (!spaceTemplatePosition) {
            throw new BadRequestException(
                'The "space_template_position_id" not found: ' +
                    data.space_template_position_id,
            );
        }

        spaceVideoEntity.spaceTemplatePosition = spaceTemplatePosition;

        const createSpaceVideo = await spaceVideoRepository.save(
            spaceVideoEntity,
        );

        return createSpaceVideo;
    }

    private async createSpaceImage(
        data: SpaceImageDto,
        space: Space,
        spaceImageRepository: Repository<SpaceImage>,
        spaceTemplatePositionRepository: Repository<SpaceTemplatePosition>,
    ) {
        const imageRepository = this.dataSource.getRepository(Image);
        const spaceImageEntity = this.spaceImageConverter.toEntity(data);
        const image = await imageRepository.findOneBy({
            id: data.select_media_id,
        });
        spaceImageEntity.image = image;

        if (data.media_data) {
            const newImageId = await this.createUrlMedias(data.media_data);
            const newImage = await imageRepository.findOneBy({
                id: newImageId,
            });
            spaceImageEntity.image = newImage;
        }
        spaceImageEntity.space = space;
        const spaceTemplatePosition =
            await spaceTemplatePositionRepository.findOneBy({
                id: data.space_template_position_id,
            });

        if (!spaceTemplatePosition) {
            throw new BadRequestException(
                'The "space_template_position_id" not found: ' +
                    data.space_template_position_id,
            );
        }

        spaceImageEntity.spaceTemplatePosition = spaceTemplatePosition;

        const createSpaceImage = await spaceImageRepository.save(
            spaceImageEntity,
        );

        return createSpaceImage;
    }
    private async createLocation(
        data: LocationDto,
        space: Space,
        LocationRepository: Repository<Location>,
        spaceTemplateLocationRepository: Repository<SpaceTemplateLocation>,
    ) {
        const locationEntity = this.locationConverter.toEntity(data);

        locationEntity.space = space;
        const spaceTemplateLocation =
            await spaceTemplateLocationRepository.findOneBy({
                id: data.space_template_location_id,
            });

        if (!spaceTemplateLocation) {
            throw new BadRequestException(
                'The "space_template_location_id" not found: ' +
                    data.space_template_location_id,
            );
        }

        locationEntity.spaceTemplateLocation = spaceTemplateLocation;
        const createLocation = await LocationRepository.save(locationEntity);

        return createLocation;
    }

    private async createSpaceData(
        spaceDto: SpaceDto,
        space: Space,
        spaceImageRepository: Repository<SpaceImage>,
        spaceVideoRepository: Repository<SpaceVideo>,
        spaceTemplatePositionRepository: Repository<SpaceTemplatePosition>,
        spaceTemplateLocationRepository: Repository<SpaceTemplateLocation>,
        locationRepository: Repository<Location>,
    ) {
        await Promise.all(
            spaceDto.space_images?.map(async (data) => {
                const newSpaceImage = await this.createSpaceImage(
                    data,
                    space,
                    spaceImageRepository,
                    spaceTemplatePositionRepository,
                );
                return newSpaceImage;
            }),
        );
        await Promise.all(
            spaceDto.space_videos?.map(async (data) => {
                const newSpaceVideo = await this.createSpaceVideo(
                    data,
                    space,
                    spaceVideoRepository,
                    spaceTemplatePositionRepository,
                );
                return newSpaceVideo;
            }),
        );
        await Promise.all(
            spaceDto.locations?.map(async (data) => {
                const newSpaceVideo = await this.createLocation(
                    data,
                    space,
                    locationRepository,
                    spaceTemplateLocationRepository,
                );
                return newSpaceVideo;
            }),
        );
        return space;
    }
}
