import { DbConnection } from '@/database/config/db';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
    NotFoundException,
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import { Space as SpaceDto } from '@/components/exhibition/dto/space.dto';
import { Space } from '@/components/exhibition/entities/space.entity';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';
import { SpaceConverter } from '@/components/exhibition/converters/space.converter';
import { SpaceTemplatePosition } from '../entities/space-template-position.entity';
import { SpaceImage } from '../entities/space-image.entity';
import { SpaceVideo } from '../entities/space-video.entity';
import { SpaceImage as SpaceImageDto } from '../dto/space-image.dto';
import { SpaceVideo as SpaceVideoDto } from '../dto/space-video.dto';
import { SpaceVideoConverter } from '../converters/space-video.converter';
import { SpaceImageConverter } from '../converters/space-image.converter';
import { Video } from '../entities/video.entity';
import { Image } from '../entities/image.entity';
import { UtilService } from '@/utils/helper/util.service';

@Injectable()
export class SpaceService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly spaceConverter: SpaceConverter,
        private readonly spaceVideoConverter: SpaceVideoConverter,
        private readonly spaceImageConverter: SpaceImageConverter,
        private readonly utilService: UtilService,
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
                const spaceTemplateRepository =
                    manager.getRepository(SpaceTemplate);
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

    private async createSpaceVideo(
        data: SpaceVideoDto,
        space: Space,
        spaceVideoRepository: Repository<SpaceVideo>,
        spaceTemplatePositionRepository: Repository<SpaceTemplatePosition>,
    ) {
        const videoRepository = this.dataSource.getRepository(Video);
        const spaceVideoEntity = this.spaceVideoConverter.toEntity(data);
        const newVideo = new Video();
        newVideo.videoId = data.select_media_id;

        if (data.media_data) {
            const newVideoId = await this.utilService.createUrlMedias(
                data.media_data,
            );
            newVideo.videoId = newVideoId;
        }
        const createdVideo = await videoRepository.save(newVideo);
        spaceVideoEntity.video = createdVideo;
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
        const imageEntity = new Image();
        imageEntity.imageId = data.select_media_id;

        if (data.media_data) {
            const newImageId = await this.utilService.createUrlMedias(
                data.media_data,
            );
            imageEntity.imageId = newImageId;
        }

        const createdImage = await imageRepository.save(imageEntity);
        spaceImageEntity.image = createdImage;
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

    private async createSpaceData(
        spaceDto: SpaceDto,
        space: Space,
        spaceImageRepository: Repository<SpaceImage>,
        spaceVideoRepository: Repository<SpaceVideo>,
        spaceTemplatePositionRepository: Repository<SpaceTemplatePosition>,
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

        return space;
    }
}
