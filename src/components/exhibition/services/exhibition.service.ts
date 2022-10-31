import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { BoothOrganization } from '@/components/exhibition/entities/booth-organization.entity';
import { Category } from '@/components/exhibition/entities/category.entity';
import { Exhibition } from '@/components/exhibition/entities/exhibition.entity';
import { Space } from '@/components/exhibition/entities/space.entity';
import { DbConnection } from '@/database/config/db';

import { ExhibitionConverter } from '@/components/exhibition/converters/exhibition.converter';
import { Exhibition as ExhibitionDto } from '@/components/exhibition/dto/exhibition.dto';
import { ExhibitionListConverter } from '@/components/exhibition/converters/exhibition-list.converter';
import { Booth } from '@/components/exhibition/entities/booth.entity';

import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';

@Injectable()
export class ExhibitionService {
    constructor(
        @InjectRepository(Exhibition, DbConnection.exhibitionCon)
        private readonly exhibitionRepository: Repository<Exhibition>,
        @InjectRepository(Booth, DbConnection.exhibitionCon)
        private readonly boothRepository: Repository<Booth>,
        private readonly exhibitionConverter: ExhibitionConverter,
        private readonly exhibitionListConverter: ExhibitionListConverter,
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
    ) {}

    private checkDateExhibition(exhibitionDto: ExhibitionDto) {
        if (
            exhibitionDto.date_exhibition_start >
            exhibitionDto.date_exhibition_end
        ) {
            return false;
        }
        return true;
    }

    async findExhibitions(query: PaginateQuery) {
        const sortableColumns = ['id', 'name', 'createdAt'];
        const searchableColumns = ['name'];
        const filterableColumns = ['status'];
        const defaultSortBy = [['createdAt', 'DESC']];
        const populatableColumns = [
            'category',
            'space',
            'boothOrganization',
            'boothTemplates',
            'spaceTemplate',
        ];
        const [exhibitions, total] = await paginate(
            query,
            this.exhibitionRepository,
            {
                searchableColumns,
                sortableColumns,
                populatableColumns,
                filterableColumns,
                defaultSortBy,
            },
        );

        return this.exhibitionListConverter.toDto(
            query.page,
            query.limit,
            total,
            exhibitions,
        );
    }

    async findById(id: string): Promise<ExhibitionDto> {
        const exhibitionId = parseInt(id);
        const exhibitionEntity = await this.exhibitionRepository.findOne({
            where: {
                id: exhibitionId,
            },
            relations: [
                'category',
                'space',
                'boothTemplates',
                'spaceTemplate',
                'boothOrganization',
                'boothOrganization.boothTemplate',
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

    private async createSpace(
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

    private async createBoothOrganization(
        boothTemplate: BoothTemplate,
        boothOrganizationRepository: Repository<BoothOrganization>,
    ): Promise<BoothOrganization> {
        const boothOrganizationEntity = new BoothOrganization();
        boothOrganizationEntity.name = `Gian hàng ban tổ chức`;
        // TODO: handle getUserId from access token
        boothOrganizationEntity.userId = 1;
        boothOrganizationEntity.boothTemplate = boothTemplate;
        return await boothOrganizationRepository.save(boothOrganizationEntity);
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
                const boothOrganizationRepository =
                    manager.getRepository(BoothOrganization);
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

                const boothOrganizationTemplate =
                    await this.findBoothTemplateById(
                        exhibitionDto.organization_booth_template_id,
                        boothTemplateRepository,
                    );

                const space = await this.createSpace(
                    spaceTemplate,
                    spaceRepository,
                );

                const boothOrganization = await this.createBoothOrganization(
                    boothOrganizationTemplate,
                    boothOrganizationRepository,
                );

                const exhibitionEntity =
                    this.exhibitionConverter.toEntity(exhibitionDto);

                exhibitionEntity.category = firstCategory;
                exhibitionEntity.boothTemplates = boothTemplates;
                exhibitionEntity.spaceTemplate = spaceTemplate;
                exhibitionEntity.space = space;
                exhibitionEntity.boothOrganization = boothOrganization;
                exhibitionEntity.status = 'new';
                const createdExhibition = await exhibitionRepository.save(
                    exhibitionEntity,
                );

                createdExhibition.boothOrganization = boothOrganization;

                return createdExhibition;
            },
        );

        return this.exhibitionConverter.toDto(createdExhibition);
    }
}
