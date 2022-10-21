import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Booth } from '@/components/exhibition/entities/booth.entity';
import { Category } from '@/components/exhibition/entities/category.entity';
import { Exhibition } from '@/components/exhibition/entities/exhibition.entity';
import { Space } from '@/components/exhibition/entities/space.entity';
import { DbConnection } from '@/database/config/db';

import { ExhibitionConverter } from '@/components/exhibition/converters/exhibition.converter';
import { Exhibition as ExhibitionDto } from '@/components/exhibition/dto/exhibition.dto';

import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';

@Injectable()
export class ExhibitionService {
    constructor(
        @InjectRepository(Exhibition, DbConnection.exhibitionCon)
        private readonly exhibitionRepository: Repository<Exhibition>,
        private readonly exhibitionConverter: ExhibitionConverter,
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
    ) {}

    private checkDateExhibition(exhibitionDto: ExhibitionDto) {
        if (
            exhibitionDto.date_exhibition_start >
                exhibitionDto.date_exhibition_end ||
            exhibitionDto.date_input_data_start >
                exhibitionDto.date_input_data_end ||
            exhibitionDto.date_input_data_end >
                exhibitionDto.date_exhibition_end ||
            exhibitionDto.date_input_data_start >
                exhibitionDto.date_exhibition_end
        ) {
            return false;
        }
        return true;
    }

    async findById(id: string): Promise<ExhibitionDto> {
        const exhibitionId = parseInt(id);
        const exhibitionEntity = await this.exhibitionRepository.findOne({
            where: {
                id: exhibitionId,
            },
            relations: [
                'category',
                'booths.boothTemplate',
                'space',
                'boothTemplates',
                'spaceTemplate',
            ],
        });

        if (!exhibitionEntity) {
            throw new NotFoundException(
                `The 'exhibition_id' ${exhibitionId} not found`,
            );
        }
        return this.exhibitionConverter.toDto(exhibitionEntity);
    }

    private async findCategoryById(
        id: number,
        categoryRepository: Repository<Category>,
    ): Promise<Category> {
        const firstCategory = await categoryRepository.findOneBy({
            id,
        });
        if (!firstCategory) {
            throw new BadRequestException("The 'category_id' is not found");
        }
        return firstCategory;
    }

    private async findBoothTemplateById(
        id: number,
        boothTemplateRepository: Repository<BoothTemplate>,
    ): Promise<BoothTemplate> {
        const boothTemplate = await boothTemplateRepository.findOneBy({
            id: id,
        });
        if (!boothTemplate) {
            throw new BadRequestException(
                `The booth template id '${id}' is not found`,
            );
        }
        return boothTemplate;
    }

    private async findSpaceTemplateById(
        id: number,
        spaceTemplateRepository: Repository<SpaceTemplate>,
    ): Promise<SpaceTemplate> {
        const spaceTemplate = await spaceTemplateRepository.findOneBy({
            id: id,
        });
        if (!spaceTemplate) {
            throw new BadRequestException(
                `The space template id '${id}' is not found`,
            );
        }
        return spaceTemplate;
    }

    private async createSpaces(
        spaceTemplate: SpaceTemplate,
        spaceRepository: Repository<Space>,
    ): Promise<Space> {
        const spaceEntity = new Space();
        spaceEntity.name = 'Khong gian trien lam mac dinh';
        spaceEntity.userId = 1; // TODO: handle getUserId from access token
        spaceEntity.spaceTemplate = spaceTemplate;

        const createdSpaces = await spaceRepository.save(spaceEntity);

        return createdSpaces;
    }

    private async createBooth(
        boothTemplate: BoothTemplate,
        exhibition: Exhibition,
        boothRepository: Repository<Booth>,
    ): Promise<Booth> {
        const boothEntity = new Booth();
        boothEntity.name = `Gian hàng ban tổ chức`;
        // TODO: handle getUserId from access token
        boothEntity.userId = 1;
        boothEntity.boothTemplate = boothTemplate;
        boothEntity.exhibition = exhibition;
        boothEntity.isOrganization = true;
        return await boothRepository.save(boothEntity);
    }

    async createExhibition(
        exhibitionDto: ExhibitionDto,
    ): Promise<ExhibitionDto> {
        if (!this.checkDateExhibition(exhibitionDto)) {
            throw new BadRequestException('The exhibition time is not correct');
        }

        const createdExhibition = await this.dataSource.transaction(
            async (manager) => {
                const exhibitionRepository = manager.getRepository(Exhibition);
                const categoryRepository = manager.getRepository(Category);
                const boothRepository = manager.getRepository(Booth);
                const spaceRepository = manager.getRepository(Space);
                const spaceTemplateRepository =
                    manager.getRepository(SpaceTemplate);
                const boothTemplateRepository =
                    manager.getRepository(BoothTemplate);

                const firstCategory = await this.findCategoryById(
                    exhibitionDto.category_id,
                    categoryRepository,
                );

                const boothTemplates = await Promise.all(
                    exhibitionDto.booth_template_ids.map(
                        async (boothTemplateId) => {
                            const boothTemplate =
                                await this.findBoothTemplateById(
                                    boothTemplateId,
                                    boothTemplateRepository,
                                );
                            return boothTemplate;
                        },
                    ),
                );

                const spaceTemplate = await this.findSpaceTemplateById(
                    exhibitionDto.space_template_id,
                    spaceTemplateRepository,
                );

                const exhibitionEntity =
                    this.exhibitionConverter.toEntity(exhibitionDto);

                const space = await this.createSpaces(
                    spaceTemplate,
                    spaceRepository,
                );

                exhibitionEntity.category = firstCategory;
                exhibitionEntity.boothTemplates = boothTemplates;
                exhibitionEntity.spaceTemplate = spaceTemplate;

                exhibitionEntity.space = space;

                const createdExhibition = await exhibitionRepository.save(
                    exhibitionEntity,
                );

                // creating a organization's booth
                const organizationBoothTemplate =
                    await this.findBoothTemplateById(
                        exhibitionDto.organization_booth_template_id,
                        boothTemplateRepository,
                    );
                const booth = await this.createBooth(
                    organizationBoothTemplate,
                    createdExhibition,
                    boothRepository,
                );
                createdExhibition.booths = [];
                createdExhibition.booths.push(booth);

                return createdExhibition;
            },
        );

        return this.exhibitionConverter.toDto(createdExhibition);
    }
}
