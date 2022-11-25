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
import { Conference as ConferenceDto } from '@/components/exhibition/dto/conference.dto';
import { Conference } from '@/components/exhibition/entities/conference.entity';
import { ConferenceTemplate } from '@/components/exhibition/entities/conference-template.entity';
import { ConferenceConverter } from '@/components/exhibition/converters/conference.converter';
import { HttpService } from '@nestjs/axios';
import { ConferenceTemplatePosition } from '../entities/conference-template-position.entity';
import { ConferenceImage } from '../entities/conference-image.entity';
import { ConferenceVideo } from '../entities/conference-video.entity';
import { ConferenceImage as ConferenceImageDto } from '../dto/conference-image.dto';
import { ConferenceVideo as ConferenceVideoDto } from '../dto/conference-video.dto';
import { ConferenceVideoConverter } from '../converters/conference-video.converter';
import { ConferenceImageConverter } from '../converters/conference-image.converter';
import { Video } from '../entities/video.entity';
import { Image } from '../entities/image.entity';

@Injectable()
export class ConferenceService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly conferenceConverter: ConferenceConverter,
        private readonly conferenceVideoConverter: ConferenceVideoConverter,
        private readonly conferenceImageConverter: ConferenceImageConverter,
    ) {}

    async updateConference(conferenceId: string, conferenceDto: ConferenceDto) {
        const updatedConference = await this.dataSource.transaction(
            async (manager) => {
                const conferenceRepository = manager.getRepository(Conference);
                const conferenceImageRepository =
                    manager.getRepository(ConferenceImage);
                const conferenceVideoRepository =
                    manager.getRepository(ConferenceVideo);
                const conferenceTemplatePositionRepository =
                    manager.getRepository(ConferenceTemplatePosition);
                const conferenceTemplateRepository =
                    manager.getRepository(ConferenceTemplate);
                let conferenceEntity = await conferenceRepository.findOne({
                    where: {
                        id: parseInt(conferenceId),
                    },
                    relations: ['exhibition'],
                });

                if (!conferenceEntity) {
                    throw new NotFoundException(
                        `The 'Conference_id' ${conferenceId} is not found`,
                    );
                }

                const conferenceTemplate =
                    await conferenceTemplateRepository.findOneBy({
                        id: conferenceDto.conference_template_id,
                    });

                if (!conferenceTemplate) {
                    throw new BadRequestException(
                        "The 'Conference_template_id' is not found ",
                    );
                }

                conferenceEntity = await this.removeOldConferenceData(
                    conferenceEntity,
                    conferenceImageRepository,
                    conferenceVideoRepository,
                );
                await this.createConferenceData(
                    conferenceDto,
                    conferenceEntity,
                    conferenceImageRepository,
                    conferenceVideoRepository,
                    conferenceTemplatePositionRepository,
                );
                return conferenceEntity;
            },
        );

        return this.conferenceConverter.toDto(updatedConference);
    }

    private async removeOldConferenceData(
        conference: Conference,
        conferenceImageRepository: Repository<ConferenceImage>,
        conferenceVideoRepository: Repository<ConferenceVideo>,
    ) {
        const conferenceImages = await conferenceImageRepository.find({
            where: {
                conference: {
                    id: conference.id,
                },
            },
        });
        await conferenceImageRepository.remove(conferenceImages);
        const conferenceVideos = await conferenceVideoRepository.find({
            where: {
                conference: {
                    id: conference.id,
                },
            },
        });

        await conferenceVideoRepository.remove(conferenceVideos);
        return conference;
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

    private async createConferenceVideo(
        data: ConferenceVideoDto,
        conference: Conference,
        conferenceVideoRepository: Repository<ConferenceVideo>,
        conferenceTemplatePositionRepository: Repository<ConferenceTemplatePosition>,
    ) {
        const videoRepository = this.dataSource.getRepository(Video);
        const conferenceVideoEntity =
            this.conferenceVideoConverter.toEntity(data);
        const newVideo = new Video();
        newVideo.videoId = data.select_media_id;

        if (data.media_data) {
            const newVideoId = await this.createUrlMedias(data.media_data);
            newVideo.videoId = newVideoId;
        }
        const createdVideo = await videoRepository.save(newVideo);
        conferenceVideoEntity.video = createdVideo;
        conferenceVideoEntity.conference = conference;
        const conferenceTemplatePosition =
            await conferenceTemplatePositionRepository.findOneBy({
                id: data.conference_template_position_id,
            });

        if (!conferenceTemplatePosition) {
            throw new BadRequestException(
                'The "conference_template_position_id" not found: ' +
                    data.conference_template_position_id,
            );
        }

        conferenceVideoEntity.conferenceTemplatePosition =
            conferenceTemplatePosition;

        const createConferenceVideo = await conferenceVideoRepository.save(
            conferenceVideoEntity,
        );

        return createConferenceVideo;
    }

    private async createConferenceImage(
        data: ConferenceImageDto,
        conference: Conference,
        conferenceImageRepository: Repository<ConferenceImage>,
        conferenceTemplatePositionRepository: Repository<ConferenceTemplatePosition>,
    ) {
        const imageRepository = this.dataSource.getRepository(Image);
        const conferenceImageEntity =
            this.conferenceImageConverter.toEntity(data);
        const imageEntity = new Image();
        imageEntity.imageId = data.select_media_id;

        if (data.media_data) {
            const newImageId = await this.createUrlMedias(data.media_data);
            imageEntity.imageId = newImageId;
        }

        const createdImage = await imageRepository.save(imageEntity);
        conferenceImageEntity.image = createdImage;
        conferenceImageEntity.conference = conference;
        const conferenceTemplatePosition =
            await conferenceTemplatePositionRepository.findOneBy({
                id: data.conference_template_position_id,
            });

        if (!conferenceTemplatePosition) {
            throw new BadRequestException(
                'The "conference_template_position_id" not found: ' +
                    data.conference_template_position_id,
            );
        }

        conferenceImageEntity.conferenceTemplatePosition =
            conferenceTemplatePosition;

        const createConferenceImage = await conferenceImageRepository.save(
            conferenceImageEntity,
        );

        return createConferenceImage;
    }

    private async createConferenceData(
        conferenceDto: ConferenceDto,
        conference: Conference,
        conferenceImageRepository: Repository<ConferenceImage>,
        conferenceVideoRepository: Repository<ConferenceVideo>,
        conferenceTemplatePositionRepository: Repository<ConferenceTemplatePosition>,
    ) {
        await Promise.all(
            conferenceDto.conference_images?.map(async (data) => {
                const newConferenceImage = await this.createConferenceImage(
                    data,
                    conference,
                    conferenceImageRepository,
                    conferenceTemplatePositionRepository,
                );
                return newConferenceImage;
            }),
        );
        await Promise.all(
            conferenceDto.conference_videos?.map(async (data) => {
                const newConferenceVideo = await this.createConferenceVideo(
                    data,
                    conference,
                    conferenceVideoRepository,
                    conferenceTemplatePositionRepository,
                );
                return newConferenceVideo;
            }),
        );

        return conference;
    }
}