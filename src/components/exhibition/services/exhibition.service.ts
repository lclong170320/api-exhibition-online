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
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { BoothConverter } from '../converters/booth.converter';
import { BoothDataConverter } from '../converters/booth-data.converter';
import { ProductConverter } from '../converters/product.converter';
import { LiveStreamConverter } from '../converters/live-stream.converter';
import { ProjectConverter } from '../converters/project.converter';
import { Booth as BoothDto } from '@/components/exhibition/dto/booth.dto';
import { LiveStream } from '../entities/live-stream.entity';
import { BoothData } from '../entities/booth-data.entity';
import { Project } from '../entities/project.entity';
import { Product } from '../entities/product.entity';
import { lastValueFrom, map } from 'rxjs';
import { LocationStatus } from '../entities/location-status.entity';
import { PositionBooth } from '../entities/position-booth.entity';
import { LiveStream as LiveStreamDto } from '@/components/exhibition/dto/live-stream.dto';
import { BoothData as BoothDataDto } from '@/components/exhibition/dto/booth-data.dto';
import { Project as ProjectDto } from '@/components/exhibition/dto/project.dto';
import { Product as ProductDto } from '@/components/exhibition/dto/product.dto';

@Injectable()
export class ExhibitionService {
    constructor(
        @InjectRepository(Exhibition, DbConnection.exhibitionCon)
        private readonly exhibitionRepository: Repository<Exhibition>,
        private readonly exhibitionConverter: ExhibitionConverter,
        private readonly exhibitionListConverter: ExhibitionListConverter,
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly boothDataConverter: BoothDataConverter,
        private readonly productConverter: ProductConverter,
        private readonly liveStreamConverter: LiveStreamConverter,
        private readonly projectConverter: ProjectConverter,
        private readonly boothConverter: BoothConverter,
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

    private async removeOldBoothDataRelations(
        booth: Booth,
        liveStreamRepository: Repository<LiveStream>,
        boothDataRepository: Repository<BoothData>,
        projectRepository: Repository<Project>,
        productRepository: Repository<Product>,
    ) {
        if (booth.liveStreams) {
            await liveStreamRepository.remove(booth.liveStreams);
            booth.liveStreams = [];
        }
        if (booth.boothData) {
            await boothDataRepository.remove(booth.boothData);
            booth.boothData = [];
        }
        if (booth.projects) {
            await projectRepository.remove(booth.projects);
            booth.projects = [];
        }
        if (booth.products) {
            await productRepository.remove(booth.products);
            booth.products = [];
        }
        return booth;
    }

    async getBoothById(
        exhibitionId: string,
        boothId: string,
        populate: string[],
    ) {
        const exhibitionEntity = await this.exhibitionRepository.findOne({
            where: {
                id: parseInt(exhibitionId),
            },
        });

        if (!exhibitionEntity) {
            throw new NotFoundException(
                `The 'exhibition_id' ${exhibitionId} not found`,
            );
        }
        const allowPopulate = [
            'boothData.positionBooth',
            'products.positionBooth',
            'projects.positionBooth',
            'boothTemplate',
            'locationStatus',
        ];
        populate.forEach((value) => {
            if (!allowPopulate.includes(value)) {
                throw new BadRequestException(
                    'Query value is not allowed ' + value,
                );
            }
        });
        const boothRepository = this.dataSource.getRepository(Booth);
        const firstBooth = await boothRepository.findOne({
            where: {
                id: parseInt(boothId),
                exhibition: exhibitionEntity.booths,
            },
            relations: [
                'liveStreams',
                'boothData',
                'products',
                'projects',
                ...populate,
            ],
        });

        if (!firstBooth) {
            throw new NotFoundException(
                `The booth is not found: exhibition_id: ${exhibitionId} and booth_id: ${boothId}`,
            );
        }
        return this.boothConverter.toDto(firstBooth);
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

    private async getLocationStatusById(
        id: number,
        locationStatusRepository: Repository<LocationStatus>,
    ): Promise<LocationStatus> {
        const firstLocationStatus = await locationStatusRepository.findOneBy({
            id,
        });
        if (!firstLocationStatus) {
            throw new BadRequestException(
                "The 'location_status_id' is not found",
            );
        }
        return firstLocationStatus;
    }

    private async getBoothTemplateById(
        id: number,
        boothTemplateRepository: Repository<BoothTemplate>,
    ): Promise<BoothTemplate> {
        const firstBoothTemplate = await boothTemplateRepository.findOneBy({
            id,
        });
        if (!firstBoothTemplate) {
            throw new BadRequestException(
                "The 'booth_template_id' is not found",
            );
        }
        return firstBoothTemplate;
    }

    private async getExhibitionById(
        id: number,
        exhibitionRepository: Repository<Exhibition>,
    ): Promise<Exhibition> {
        const firstExhibition = await exhibitionRepository.findOneBy({
            id,
        });
        if (!firstExhibition) {
            throw new BadRequestException("The 'exhibition_id' is not found");
        }
        return firstExhibition;
    }

    private async getEnterpriseById(id: number): Promise<number> {
        const url = this.configService.get('GETTING_ENTERPRISE_URL');
        const firstEnterprise = this.httpService.get(`${url}/${id}`);
        const response = firstEnterprise.pipe(
            map((res) => {
                return res.data;
            }),
        );
        const parseValueEnterprise = await lastValueFrom(response);

        if (!parseValueEnterprise) {
            throw new BadRequestException("The 'enterprise_id' is not found");
        }

        return parseValueEnterprise.id;
    }

    private async getPositionBoothById(
        id: number,
        positionBoothRepository: Repository<PositionBooth>,
    ): Promise<PositionBooth> {
        const firstPositionBooth = await positionBoothRepository.findOneBy({
            id,
        });
        if (!firstPositionBooth) {
            throw new BadRequestException(
                "The 'position_booth_id' is not found",
            );
        }
        return firstPositionBooth;
    }

    private async createLiveStream(
        listOfLiveStreamDto: LiveStreamDto[],
        booth: Booth,
        liveStreamRepository: Repository<LiveStream>,
    ): Promise<LiveStream[]> {
        const listOfCreatedLiveStream = Promise.all(
            listOfLiveStreamDto.map(async (liveStreamDto) => {
                const liveStreamToEntity =
                    this.liveStreamConverter.toEntity(liveStreamDto);

                liveStreamToEntity.booth = booth;

                const createdLiveStream = await liveStreamRepository.save(
                    liveStreamToEntity,
                );

                return createdLiveStream;
            }),
        );

        return listOfCreatedLiveStream;
    }

    private async createBoothData(
        listOfBoothDataDto: BoothDataDto[],
        booth: Booth,
        boothDataRepository: Repository<BoothData>,
        positionBoothRepository: Repository<PositionBooth>,
    ): Promise<BoothData[]> {
        const listOfCreatedBoothData = await Promise.all(
            listOfBoothDataDto.map(async (boothDataDto) => {
                const boothDataToEntity = new BoothData();

                boothDataToEntity.mediaId = boothDataDto.selected_media_id;

                if (boothDataDto.media_data) {
                    boothDataToEntity.mediaId = await this.createUrlMedias(
                        boothDataDto.media_data,
                    );
                }

                const firstPositionBooth = await this.getPositionBoothById(
                    boothDataDto.position_booth_id,
                    positionBoothRepository,
                );

                boothDataToEntity.booth = booth;
                boothDataToEntity.positionBooth = firstPositionBooth;

                const createdBoothData = await boothDataRepository.save(
                    boothDataToEntity,
                );

                return createdBoothData;
            }),
        );

        return listOfCreatedBoothData;
    }

    private async createProjects(
        listOfProjectDto: ProjectDto[],
        booth: Booth,
        projectRepository: Repository<Project>,
        positionBoothRepository: Repository<PositionBooth>,
    ): Promise<Project[]> {
        let listOfCreatedProject = [];
        if (listOfProjectDto) {
            listOfCreatedProject = await Promise.all(
                listOfProjectDto.map(async (projectDto) => {
                    const projectToEntity =
                        this.projectConverter.toEntity(projectDto);

                    projectToEntity.mediaId = projectDto.selected_media_id;

                    if (projectDto.media_data) {
                        projectToEntity.mediaId = await this.createUrlMedias(
                            projectDto.media_data,
                        );
                    }

                    const firstPositionBooth = await this.getPositionBoothById(
                        projectDto.position_booth_id,
                        positionBoothRepository,
                    );

                    projectToEntity.booth = booth;
                    projectToEntity.positionBooth = firstPositionBooth;

                    const createdBoothData = await projectRepository.save(
                        projectToEntity,
                    );

                    return createdBoothData;
                }),
            );
        }

        return listOfCreatedProject;
    }

    private async createProducts(
        listOfProductDto: ProductDto[],
        booth: Booth,
        productRepository: Repository<Product>,
        positionBoothRepository: Repository<PositionBooth>,
    ): Promise<Product[]> {
        let listOfCreatedProduct = [];
        if (listOfProductDto) {
            listOfCreatedProduct = await Promise.all(
                listOfProductDto.map(async (productDto) => {
                    const productToEntity =
                        this.productConverter.toEntity(productDto);

                    productToEntity.mediaId = productDto.selected_media_id;

                    if (productDto.media_data) {
                        productToEntity.mediaId = await this.createUrlMedias(
                            productDto.media_data,
                        );
                    }

                    const firstPositionBooth = await this.getPositionBoothById(
                        productDto.position_booth_id,
                        positionBoothRepository,
                    );

                    productToEntity.booth = booth;
                    productToEntity.positionBooth = firstPositionBooth;

                    const createdBoothData = await productRepository.save(
                        productToEntity,
                    );

                    return createdBoothData;
                }),
            );
        }

        return listOfCreatedProduct;
    }

    async updateBooth(
        exhibitionId: string,
        boothId: string,
        boothDto: BoothDto,
    ) {
        const updatedBooth = await this.dataSource.transaction(
            async (manager) => {
                const boothRepository = manager.getRepository(Booth);
                const locationStatusRepository =
                    manager.getRepository(LocationStatus);
                const exhibitionRepository = manager.getRepository(Exhibition);
                const boothTemplateRepository =
                    manager.getRepository(BoothTemplate);
                const liveStreamRepository = manager.getRepository(LiveStream);
                const boothDataRepository = manager.getRepository(BoothData);
                const projectRepository = manager.getRepository(Project);
                const productRepository = manager.getRepository(Product);
                const positionBoothRepository =
                    manager.getRepository(PositionBooth);

                const firstExhibition = await this.getExhibitionById(
                    parseInt(exhibitionId),
                    exhibitionRepository,
                );

                const boothEntity = await boothRepository.findOne({
                    where: {
                        id: parseInt(boothId),
                        exhibition: firstExhibition.booths,
                    },
                    relations: [
                        'liveStreams',
                        'boothTemplate',
                        'boothData',
                        'products',
                        'projects',
                        'locationStatus',
                    ],
                });
                if (!boothEntity) {
                    throw new NotFoundException(
                        `The 'booth_id' ${boothId} is not found`,
                    );
                }

                const firstLocationStatus = await this.getLocationStatusById(
                    boothDto.location_status_id,
                    locationStatusRepository,
                );
                const enterpriseId = await this.getEnterpriseById(
                    boothDto.enterprise_id,
                );
                const firstBoothTemplate = await this.getBoothTemplateById(
                    boothDto.booth_template_id,
                    boothTemplateRepository,
                );

                boothEntity.name = boothDto.name;
                boothEntity.createdBy = 1; // TODO: handle getUserId from access token
                boothEntity.exhibition = firstExhibition;
                boothEntity.boothTemplate = firstBoothTemplate;
                boothEntity.locationStatus = firstLocationStatus;
                boothEntity.enterpriseId = enterpriseId;

                await this.removeOldBoothDataRelations(
                    boothEntity,
                    liveStreamRepository,
                    boothDataRepository,
                    projectRepository,
                    productRepository,
                );

                const createdBooth = await boothRepository.save(boothEntity);

                const createdLiveStreams = await this.createLiveStream(
                    boothDto.live_streams,
                    createdBooth,
                    liveStreamRepository,
                );

                const createdBoothData = await this.createBoothData(
                    boothDto.booth_data,
                    createdBooth,
                    boothDataRepository,
                    positionBoothRepository,
                );

                createdBooth.liveStreams = createdLiveStreams;
                createdBooth.boothData = createdBoothData;

                let createdProduct = null;
                let createdProject = null;

                if (boothDto.products) {
                    createdProduct = await this.createProducts(
                        boothDto.products,
                        createdBooth,
                        productRepository,
                        positionBoothRepository,
                    );
                    createdBooth.products = createdProduct;
                }

                if (boothDto.projects) {
                    createdProject = await this.createProjects(
                        boothDto.projects,
                        createdBooth,
                        projectRepository,
                        positionBoothRepository,
                    );
                    createdBooth.projects = createdProject;
                }
                return createdBooth;
            },
        );

        return this.boothConverter.toDto(updatedBooth);
    }

    async createBooth(exhibitionId, boothDto: BoothDto) {
        const createdBooth = await this.dataSource.transaction(
            async (manager) => {
                const boothRepository = manager.getRepository(Booth);
                const locationStatusRepository =
                    manager.getRepository(LocationStatus);
                const exhibitionRepository = manager.getRepository(Exhibition);
                const boothTemplateRepository =
                    manager.getRepository(BoothTemplate);
                const liveStreamRepository = manager.getRepository(LiveStream);
                const boothDataRepository = manager.getRepository(BoothData);
                const projectRepository = manager.getRepository(Project);
                const productRepository = manager.getRepository(Product);
                const positionBoothRepository =
                    manager.getRepository(PositionBooth);

                const firstLocationStatus = await this.getLocationStatusById(
                    boothDto.location_status_id,
                    locationStatusRepository,
                );
                const enterpriseId = await this.getEnterpriseById(
                    boothDto.enterprise_id,
                );
                const firstExhibition = await this.getExhibitionById(
                    exhibitionId,
                    exhibitionRepository,
                );

                const firstBoothTemplate = await this.getBoothTemplateById(
                    boothDto.booth_template_id,
                    boothTemplateRepository,
                );

                const boothEntity = this.boothConverter.toEntity(boothDto);

                boothEntity.createdBy = 1; // TODO: handle getUserId from access token
                boothEntity.exhibition = firstExhibition;
                boothEntity.boothTemplate = firstBoothTemplate;
                boothEntity.locationStatus = firstLocationStatus;
                boothEntity.enterpriseId = enterpriseId;

                const createdBooth = await boothRepository.save(boothEntity);

                const createdBoothData = await this.createBoothData(
                    boothDto.booth_data,
                    createdBooth,
                    boothDataRepository,
                    positionBoothRepository,
                );

                const createdLiveStreams = await this.createLiveStream(
                    boothDto.live_streams,
                    createdBooth,
                    liveStreamRepository,
                );
                const createdProjects = await this.createProjects(
                    boothDto.projects,
                    createdBooth,
                    projectRepository,
                    positionBoothRepository,
                );
                const createdProducts = await this.createProducts(
                    boothDto.products,
                    createdBooth,
                    productRepository,
                    positionBoothRepository,
                );

                createdBooth.liveStreams = createdLiveStreams;
                createdBooth.boothData = createdBoothData;
                createdBooth.products = createdProducts;
                createdBooth.projects = createdProjects;

                return createdBooth;
            },
        );

        return this.boothConverter.toDto(createdBooth);
    }
}
