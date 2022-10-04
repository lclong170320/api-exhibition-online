import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Booth } from '@/components/exhibition/entities/booth.entity';
import { Category } from '@/components/exhibition/entities/category.entity';
import { Exhibition } from '@/components/exhibition/entities/exhibition.entity';
import { Space } from '@/components/exhibition/entities/space.entity';
import { DbConnection } from '@/database/config/db';

import { ExhibitionConverter } from '@/components/exhibition/converters/exhibition.converter';
import { Exhibition as ExhibitionDto } from '@/components/exhibition/dto/exhibition.dto';

import { BoothTemplate } from '../entities/booth-template.entity';
import { SpaceTemplate } from '../entities/space-template.entity';

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
        const entity = await this.exhibitionRepository.findOne({
            where: {
                id: exhibitionId,
            },
            relations: ['panos', 'panos.markers'],
        });
        return this.exhibitionConverter.toDto(entity);
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

    private async createBooths(
        exhibition: Exhibition,
        boothRepository: Repository<Booth>,
    ): Promise<Booth[]> {
        const boothEntities: Booth[] = [];
        let start = 1;
        while (start <= exhibition.boothNumber) {
            const boothEntity = new Booth();
            boothEntity.name = `Mau ${start}`;
            boothEntity.userId = 1; // TODO: handle getUserId from access token
            boothEntity.boothTemplate = exhibition.boothTemplates[0];
            boothEntity.exhibition = exhibition;

            boothEntities.push(boothEntity);

            start++;
        }
        const createdBooths = await boothRepository.save(boothEntities);

        return createdBooths;
    }

    private async createSpace(
        exhibition: Exhibition,
        spaceRepository: Repository<Space>,
        spaceTemplateRepository: Repository<SpaceTemplate>,
    ): Promise<Space> {
        const spaceTemplateId = 1;
        const spaceEntity = new Space();
        spaceEntity.name = 'Khong gian trien lam mac dinh';
        spaceEntity.userId = 1; // TODO: handle getUserId from access token
        spaceEntity.exhibition = exhibition;
        const firstSpaceTemplate = await spaceTemplateRepository.findOneBy({
            id: spaceTemplateId,
        });
        if (!firstSpaceTemplate) {
            throw new BadRequestException(
                `The space template id '${spaceTemplateId}' is not found`,
            );
        }
        spaceEntity.spaceTemplate = firstSpaceTemplate;
        const createdSpace = await spaceRepository.save(spaceEntity);

        return createdSpace;
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

                const exhibitionEntity =
                    this.exhibitionConverter.toEntity(exhibitionDto);

                exhibitionEntity.category = firstCategory;
                exhibitionEntity.boothTemplates = boothTemplates;

                const createdExhibition = await exhibitionRepository.save(
                    exhibitionEntity,
                );
                const booths = await this.createBooths(
                    createdExhibition,
                    boothRepository,
                );

                const space = await this.createSpace(
                    createdExhibition,
                    spaceRepository,
                    spaceTemplateRepository,
                );

                createdExhibition.booths = booths;
                createdExhibition.space = space;

                return createdExhibition;
            },
        );
        return this.exhibitionConverter.toDto(createdExhibition);
    }
}
