import { DbConnection } from '@/database/config/db';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { ConferenceTemplate as ConferenceTemplateDto } from '@/components/exhibition/dto/conference-template.dto';
import { ConferenceTemplatePosition as ConferenceTemplatePositionDto } from '@/components/exhibition/dto/conference-template-position.dto';
import { ConferenceTemplate } from '@/components/exhibition/entities/conference-template.entity';
import { ConferenceTemplatePosition } from '@/components/exhibition/entities/conference-template-position.entity';
import { ConferenceTemplateConverter } from '@/components/exhibition/converters/conference-template.converter';
import { ConferenceTemplatePositionConverter } from '@/components/exhibition/converters/conference-template-position.converter';
import { UtilService } from '@/utils/helper/util.service';

@Injectable()
export class ConferenceTemplateService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private conferenceTemplateConverter: ConferenceTemplateConverter,
        private conferenceTemplatePositionConverter: ConferenceTemplatePositionConverter,
        private readonly utilService: UtilService,
    ) {}

    async createConferenceTemplate(
        userId: number,
        conferenceTemplateDto: ConferenceTemplateDto,
    ): Promise<ConferenceTemplateDto> {
        const createdConferenceTemplate = await this.dataSource.transaction(
            async (manager) => {
                const conferenceTemplateRepository =
                    manager.getRepository(ConferenceTemplate);
                const conferenceTemplatePositionRepository =
                    manager.getRepository(ConferenceTemplatePosition);

                const conferenceTemplateEntity =
                    this.conferenceTemplateConverter.toEntity(
                        conferenceTemplateDto,
                    );
                conferenceTemplateEntity.modelId =
                    await this.utilService.createUrlMedias(
                        conferenceTemplateDto.model_data,
                    );

                conferenceTemplateEntity.thumbnailId =
                    await this.utilService.createUrlMedias(
                        conferenceTemplateDto.thumbnail_data,
                    );
                conferenceTemplateEntity.createdBy = userId;
                conferenceTemplateEntity.createdDate = new Date();
                const createdConferenceTemplate =
                    await conferenceTemplateRepository.save(
                        conferenceTemplateEntity,
                    );
                const conferenceTemplatePosition = await Promise.all(
                    conferenceTemplateDto.conference_template_positions.map(
                        async (data) => {
                            const conferenceTemplatePosition =
                                await this.createConferenceTemplatePosition(
                                    data,
                                    createdConferenceTemplate,
                                    conferenceTemplatePositionRepository,
                                );
                            return conferenceTemplatePosition;
                        },
                    ),
                );
                createdConferenceTemplate.conferenceTemplatePositions =
                    conferenceTemplatePosition;

                return createdConferenceTemplate;
            },
        );

        return this.conferenceTemplateConverter.toDto(
            createdConferenceTemplate,
        );
    }

    private async createConferenceTemplatePosition(
        conferenceTemplatePositionDto: ConferenceTemplatePositionDto,
        conferenceTemplateEntity: ConferenceTemplate,
        conferenceTemplatePositionRepository: Repository<ConferenceTemplatePosition>,
    ): Promise<ConferenceTemplatePosition> {
        const conferenceTemplatePositionEntity =
            this.conferenceTemplatePositionConverter.toEntity(
                conferenceTemplatePositionDto,
            );

        conferenceTemplatePositionEntity.conferenceTemplate =
            conferenceTemplateEntity;

        const createdConferenceTemplatePosition =
            await conferenceTemplatePositionRepository.save(
                conferenceTemplatePositionEntity,
            );

        return createdConferenceTemplatePosition;
    }
}
