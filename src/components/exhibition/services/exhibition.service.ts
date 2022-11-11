import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
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
import { LiveStreamConverter } from '../converters/live-stream.converter';
import { Booth as BoothDto } from '@/components/exhibition/dto/booth.dto';
import { LiveStream } from '../entities/live-stream.entity';

import { lastValueFrom, map } from 'rxjs';
import { Location } from '../entities/location.entity';
import { LiveStream as LiveStreamDto } from '@/components/exhibition/dto/live-stream.dto';
import { BoothImage } from '../entities/booth-image.entity';
import { BoothVideo } from '../entities/booth-video.entity';
import { BoothProject } from '../entities/booth-project.entity';
import { BoothProduct } from '../entities/booth-product.entity';
import { BoothTemplatePosition } from '../entities/booth-template-position.entity';
import { BoothImage as BoothImageDto } from '../dto/booth-image.dto';
import { BoothVideo as BoothVideoDto } from '../dto/booth-video.dto';
import { BoothProject as BoothProjectDto } from '../dto/booth-project.dto';
import { BoothProduct as BoothProductDto } from '../dto/booth-product.dto';
import { Image } from '../entities/image.entity';
import { Video } from '../entities/Video.entity';
import { Project } from '../entities/project.entity';
import { Product } from '../entities/product.entity';
import { BoothOrganizationTemplate } from '../entities/booth-organization-template.entity';
import { SpaceTemplateLocation } from '../entities/space-template-location.entity';
import { Status } from '../entities/location.entity';

@Injectable()
export class ExhibitionService {
    constructor(
        private readonly exhibitionConverter: ExhibitionConverter,
        private readonly exhibitionListConverter: ExhibitionListConverter,
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly liveStreamConverter: LiveStreamConverter,
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
        const exhibitionRepository =
            this.dataSource.manager.getRepository(Exhibition);
        const [exhibitions, total] = await paginate(
            query,
            exhibitionRepository,
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

    async findExhibitionById(
        id: string,
        populate: string[],
    ): Promise<ExhibitionDto> {
        const allowPopulate = ['category', 'space', 'boothOrganization'];

        populate.forEach((value) => {
            if (!allowPopulate.includes(value)) {
                throw new BadRequestException(
                    'Query value is not allowed ' + value,
                );
            }
        });
        const exhibitionRepository =
            this.dataSource.manager.getRepository(Exhibition);
        const exhibitionEntity = await exhibitionRepository.findOne({
            where: {
                id: parseInt(id),
            },
            relations: populate,
        });

        if (!exhibitionEntity) {
            throw new NotFoundException(`The 'exhibition_id' ${id} not found`);
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

    private async findBoothOrganizationTemplateById(
        id: number,
        boothOrganizationTemplateRepository: Repository<BoothOrganizationTemplate>,
    ): Promise<BoothOrganizationTemplate> {
        const boothOrganizationTemplate =
            await boothOrganizationTemplateRepository.findOneBy({
                id: id,
            });
        if (!boothOrganizationTemplate) {
            throw new BadRequestException(
                `The booth organization template id '${id}' is not found`,
            );
        }
        return boothOrganizationTemplate;
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

    private async findSpaceTemplateLocation(
        spaceTemplateId: number,
        spaceTemplateLocationRepository: Repository<SpaceTemplateLocation>,
    ): Promise<SpaceTemplateLocation[]> {
        const spaceTemplateLocation =
            await spaceTemplateLocationRepository.findBy({
                spaceTemplate: {
                    id: spaceTemplateId,
                },
            });
        if (!spaceTemplateLocation) {
            throw new BadRequestException(`The space template is not found`);
        }
        return spaceTemplateLocation;
    }

    private async createSpace(
        spaceTemplateId: number,
        spaceRepository: Repository<Space>,
        spaceTemplateRepository: Repository<SpaceTemplate>,
    ): Promise<Space> {
        const firstSpaceTemplate = await this.findSpaceTemplateById(
            spaceTemplateId,
            spaceTemplateRepository,
        );

        const spaceEntity = new Space();
        spaceEntity.name = 'Khong gian trien lam mac dinh';
        spaceEntity.spaceTemplate = firstSpaceTemplate;

        const createdSpaces = await spaceRepository.save(spaceEntity);

        return createdSpaces;
    }

    private async createLocation(
        space: Space,
        spaceTemplateLocation: SpaceTemplateLocation,
        locationRepository: Repository<Location>,
    ): Promise<Location> {
        const LocationEntity = new Location();
        LocationEntity.space = space;
        LocationEntity.spaceTemplateLocation = spaceTemplateLocation;
        LocationEntity.status = Status.AVAILABLE;

        const createdLocation = await locationRepository.save(LocationEntity);

        return createdLocation;
    }

    private async createBoothOrganization(
        boothOrganizationTemplateId: number,
        boothOrganizationRepository: Repository<BoothOrganization>,
        boothOrganizationTemplateRepository: Repository<BoothOrganizationTemplate>,
    ): Promise<BoothOrganization> {
        const boothOrganizationTemplate =
            await this.findBoothOrganizationTemplateById(
                boothOrganizationTemplateId,
                boothOrganizationTemplateRepository,
            );

        const boothOrganizationEntity = new BoothOrganization();
        // TODO: default value
        boothOrganizationEntity.positionX = 1;
        boothOrganizationEntity.positionY = 1;
        boothOrganizationEntity.positionZ = 1;
        boothOrganizationEntity.rotationX = 1;
        boothOrganizationEntity.rotationY = 1;
        boothOrganizationEntity.rotationX = 1;
        boothOrganizationEntity.boothOrganizationTemplate =
            boothOrganizationTemplate;

        const createdBoothOrganization = await boothOrganizationRepository.save(
            boothOrganizationEntity,
        );
        return createdBoothOrganization;
    }

    async createExhibition(exhibitionDto: ExhibitionDto) {
        if (!this.checkDateExhibition(exhibitionDto)) {
            throw new BadRequestException('The exhibition time is not correct');
        }
        const createdExhibition = await this.dataSource.transaction(
            async (manager) => {
                const categoryRepository = manager.getRepository(Category);
                const exhibitionRepository = manager.getRepository(Exhibition);
                const boothOrganizationTemplateRepository =
                    manager.getRepository(BoothOrganizationTemplate);
                const boothOrganizationRepository =
                    manager.getRepository(BoothOrganization);
                const spaceTemplateRepository =
                    manager.getRepository(SpaceTemplate);
                const spaceRepository = manager.getRepository(Space);
                const spaceTemplateLocationRepository = manager.getRepository(
                    SpaceTemplateLocation,
                );
                const locationRepository = manager.getRepository(Location);

                const firstCategory = await this.findCategoryById(
                    exhibitionDto.category_id,
                    categoryRepository,
                );

                const createdBoothOrganization =
                    await this.createBoothOrganization(
                        exhibitionDto.booth_organization_template_id,
                        boothOrganizationRepository,
                        boothOrganizationTemplateRepository,
                    );

                const createdSpace = await this.createSpace(
                    exhibitionDto.space_template_id,
                    spaceRepository,
                    spaceTemplateRepository,
                );

                const spaceTemplateLocations =
                    await this.findSpaceTemplateLocation(
                        exhibitionDto.space_template_id,
                        spaceTemplateLocationRepository,
                    );

                await Promise.all(
                    spaceTemplateLocations.map(
                        async (spaceTemplateLocation) => {
                            const location = await this.createLocation(
                                createdSpace,
                                spaceTemplateLocation,
                                locationRepository,
                            );
                            return location;
                        },
                    ),
                );

                const exhibitionEntity =
                    this.exhibitionConverter.toEntity(exhibitionDto);

                exhibitionEntity.category = firstCategory;
                exhibitionEntity.space = createdSpace;
                exhibitionEntity.boothOrganization = createdBoothOrganization;
                const createdExhibition = await exhibitionRepository.save(
                    exhibitionEntity,
                );

                return createdExhibition;
            },
        );

        return this.exhibitionConverter.toDto(createdExhibition);
    }

    async getBoothById(
        exhibitionId: string,
        boothId: string,
        populate: string[],
    ) {
        const exhibitionRepository =
            this.dataSource.manager.getRepository(Exhibition);
        const exhibitionEntity = await exhibitionRepository.findOne({
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
            'boothImages.boothTemplatePosition',
            'boothProjects.boothTemplatePosition',
            'boothProducts.boothTemplatePosition',
            'boothProducts.boothTemplatePosition',
            'boothVideos.boothTemplatePosition',
            'boothTemplate',
            'location',
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
                'boothProducts',
                'boothProjects',
                'boothVideos',
                'boothImages',
                'boothProducts.product',
                'boothImages.image',
                'boothProjects.project',
                'boothVideos.video',
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

    private async getLocationById(
        id: number,
        locationRepository: Repository<Location>,
    ): Promise<Location> {
        const firstLocation = await locationRepository.findOne({
            where: {
                id: id,
            },

            relations: ['spaceTemplateLocation'],
        });
        if (!firstLocation) {
            throw new BadRequestException(`The 'id' not found: ${id}`);
        }
        return firstLocation;
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

    private async getBoothTemplatePositionById(
        id: number,
        boothTemplatePositionRepository: Repository<BoothTemplatePosition>,
    ): Promise<BoothTemplatePosition> {
        const firstBoothTemplatePosition =
            await boothTemplatePositionRepository.findOneBy({
                id,
            });
        if (!firstBoothTemplatePosition) {
            throw new BadRequestException(
                "The 'position_booth_id' is not found",
            );
        }
        return firstBoothTemplatePosition;
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

    private async createBoothImages(
        listOfBoothImageDto: BoothImageDto[],
        booth: Booth,
        boothImageRepository: Repository<BoothImage>,
        imageRepository: Repository<Image>,
        boothTemplatePositionRepository: Repository<BoothTemplatePosition>,
    ): Promise<BoothImage[]> {
        let listOfCreatedBoothImage = [];
        if (listOfBoothImageDto) {
            listOfCreatedBoothImage = await Promise.all(
                listOfBoothImageDto.map(async (boothImageDto) => {
                    const { booth_template_position_id, ...imageDto } =
                        boothImageDto;

                    const firstBoothTemplatePosition =
                        await this.getBoothTemplatePositionById(
                            booth_template_position_id,
                            boothTemplatePositionRepository,
                        );

                    const imageEntity = new Image();

                    imageEntity.imageId = imageDto.selected_media_id;

                    if (imageDto.media_data) {
                        imageEntity.imageId = await this.createUrlMedias(
                            imageDto.media_data,
                        );
                    }

                    const createdImage = await imageRepository.save(
                        imageEntity,
                    );

                    const boothImageEntity = new BoothImage();

                    boothImageEntity.booth = booth;
                    boothImageEntity.boothTemplatePosition =
                        firstBoothTemplatePosition;
                    boothImageEntity.image = createdImage;
                    const createdImageEntity = await boothImageRepository.save(
                        boothImageEntity,
                    );

                    return createdImageEntity;
                }),
            );
        }

        return listOfCreatedBoothImage;
    }

    private async createBoothVideos(
        listOfBoothVideoDto: BoothVideoDto[],
        booth: Booth,
        boothVideoRepository: Repository<BoothVideo>,
        videoRepository: Repository<Video>,
        boothTemplatePositionRepository: Repository<BoothTemplatePosition>,
    ): Promise<BoothVideo[]> {
        let listOfCreatedBoothVideo = [];
        if (listOfBoothVideoDto) {
            listOfCreatedBoothVideo = await Promise.all(
                listOfBoothVideoDto.map(async (boothVideoDto) => {
                    const { booth_template_position_id, ...videoDto } =
                        boothVideoDto;

                    const firstBoothTemplatePosition =
                        await this.getBoothTemplatePositionById(
                            booth_template_position_id,
                            boothTemplatePositionRepository,
                        );

                    const videoEntity = new Video();

                    videoEntity.videoId = videoDto.selected_media_id;

                    if (videoDto.media_data) {
                        videoEntity.videoId = await this.createUrlMedias(
                            videoDto.media_data,
                        );
                    }

                    const createdVideo = await videoRepository.save(
                        videoEntity,
                    );

                    const boothVideoEntity = new BoothVideo();

                    boothVideoEntity.booth = booth;
                    boothVideoEntity.boothTemplatePosition =
                        firstBoothTemplatePosition;
                    boothVideoEntity.video = createdVideo;
                    const createdVideoEntity = await boothVideoRepository.save(
                        boothVideoEntity,
                    );

                    return createdVideoEntity;
                }),
            );
        }

        return listOfCreatedBoothVideo;
    }

    private async createBoothProjects(
        listOfBoothProjectDto: BoothProjectDto[],
        booth: Booth,
        boothProjectRepository: Repository<BoothProject>,
        projectRepository: Repository<Project>,
        boothTemplatePositionRepository: Repository<BoothTemplatePosition>,
    ): Promise<BoothProject[]> {
        let listOfCreatedBoothProject = [];
        if (listOfBoothProjectDto) {
            listOfCreatedBoothProject = await Promise.all(
                listOfBoothProjectDto.map(
                    async (boothProjectDto: BoothProjectDto) => {
                        const { booth_template_position_id, ...projectDto } =
                            boothProjectDto;

                        const firstBoothTemplatePosition =
                            await this.getBoothTemplatePositionById(
                                booth_template_position_id,
                                boothTemplatePositionRepository,
                            );

                        const projectEntity = new Project();

                        projectEntity.imageId = projectDto.selected_media_id;

                        if (projectDto.media_data) {
                            projectEntity.imageId = await this.createUrlMedias(
                                projectDto.media_data,
                            );
                        }

                        projectEntity.title = projectDto.title;
                        projectEntity.description = projectDto.description;

                        const createdProject = await projectRepository.save(
                            projectEntity,
                        );

                        const boothProjectEntity = new BoothProject();

                        boothProjectEntity.boothTemplatePosition =
                            firstBoothTemplatePosition;
                        boothProjectEntity.booth = booth;
                        boothProjectEntity.project = createdProject;

                        const createdBoothProject =
                            await boothProjectRepository.save(
                                boothProjectEntity,
                            );

                        return createdBoothProject;
                    },
                ),
            );
        }

        return listOfCreatedBoothProject;
    }

    private async createBoothProducts(
        listOfBoothProductDto: BoothProductDto[],
        booth: Booth,
        boothProductRepository: Repository<BoothProduct>,
        productRepository: Repository<Product>,
        boothTemplatePositionRepository: Repository<BoothTemplatePosition>,
    ): Promise<BoothProduct[]> {
        let listOfCreatedBoothProduct = [];
        if (listOfBoothProductDto) {
            listOfCreatedBoothProduct = await Promise.all(
                listOfBoothProductDto.map(
                    async (boothProductDto: BoothProductDto) => {
                        const { booth_template_position_id, ...productDto } =
                            boothProductDto;

                        const firstBoothTemplatePosition =
                            await this.getBoothTemplatePositionById(
                                booth_template_position_id,
                                boothTemplatePositionRepository,
                            );

                        const productEntity = new Product();

                        productEntity.imageId = productDto.selected_media_id;

                        if (productDto.media_data) {
                            productEntity.imageId = await this.createUrlMedias(
                                productDto.media_data,
                            );
                        }

                        productEntity.name = productDto.name;
                        productEntity.price = productDto.price;
                        productEntity.description = productDto.description;
                        productEntity.purchaseLink = productDto.purchase_link;

                        const createdProduct = await productRepository.save(
                            productEntity,
                        );

                        const boothProductEntity = new BoothProduct();

                        boothProductEntity.booth = booth;
                        boothProductEntity.boothTemplatePosition =
                            firstBoothTemplatePosition;
                        boothProductEntity.product = createdProduct;

                        const createdBoothProduct =
                            await boothProductRepository.save(
                                boothProductEntity,
                            );

                        return createdBoothProduct;
                    },
                ),
            );
        }

        return listOfCreatedBoothProduct;
    }

    private async removeOldBoothRelations(
        booth: Booth,
        boothProjectRepository: Repository<BoothProject>,
        boothProductRepository: Repository<BoothProduct>,
        boothImageRepository: Repository<BoothImage>,
        boothVideoRepository: Repository<BoothVideo>,
        liveStreamRepository: Repository<LiveStream>,
        projectRepository: Repository<Project>,
        productRepository: Repository<Product>,
        imageRepository: Repository<Image>,
        videoRepository: Repository<Video>,
    ) {
        if (booth.liveStreams) {
            await liveStreamRepository.remove(booth.liveStreams);
            booth.liveStreams = [];
        }
        if (booth.boothImages) {
            await Promise.all(
                booth.boothImages.map(async (boothImage) => {
                    const firstBoothImage = await boothImageRepository.findOne({
                        where: {
                            id: boothImage.id,
                        },
                        relations: ['image'],
                    });
                    await boothImageRepository.remove(boothImage);
                    if (!firstBoothImage) {
                        throw new BadRequestException(
                            `The booth_image_id '${boothImage.id}' is not found`,
                        );
                    }
                    return await imageRepository.remove(firstBoothImage.image);
                }),
            );
            booth.boothImages = [];
        }
        if (booth.boothVideos) {
            await Promise.all(
                booth.boothVideos.map(async (boothVideo) => {
                    const firstBoothVideo = await boothVideoRepository.findOne({
                        where: {
                            id: boothVideo.id,
                        },
                        relations: ['video'],
                    });
                    await boothVideoRepository.remove(boothVideo);
                    if (!firstBoothVideo) {
                        throw new BadRequestException(
                            `The booth_video_id '${firstBoothVideo.id}' is not found`,
                        );
                    }
                    return await videoRepository.remove(firstBoothVideo.video);
                }),
            );
            booth.boothVideos = [];
        }
        if (booth.boothProducts) {
            await Promise.all(
                booth.boothProducts.map(async (boothProduct) => {
                    const firstBoothProduct =
                        await boothProductRepository.findOne({
                            where: {
                                id: boothProduct.id,
                            },
                            relations: ['product'],
                        });
                    if (!firstBoothProduct) {
                        throw new BadRequestException(
                            `The booth_product_id '${boothProduct.id}' is not found`,
                        );
                    }
                    await boothProductRepository.remove(boothProduct);
                    return await productRepository.remove(
                        firstBoothProduct.product,
                    );
                }),
            );
            booth.boothProducts = [];
        }
        if (booth.boothProjects) {
            await Promise.all(
                booth.boothProjects.map(async (boothProject) => {
                    const firstBoothProject =
                        await boothProjectRepository.findOne({
                            where: {
                                id: boothProject.id,
                            },
                            relations: ['project'],
                        });
                    if (!firstBoothProject) {
                        throw new BadRequestException(
                            `The booth_project_id '${firstBoothProject.id}' is not found`,
                        );
                    }
                    await boothProjectRepository.remove(firstBoothProject);
                    return await projectRepository.remove(
                        firstBoothProject.project,
                    );
                }),
            );

            booth.boothProjects = [];
        }
        return booth;
    }

    async createBooth(exhibitionId: number, boothDto: BoothDto) {
        const createdBooth = await this.dataSource.transaction(
            async (manager) => {
                const boothRepository = manager.getRepository(Booth);
                const locationRepository = manager.getRepository(Location);
                const exhibitionRepository = manager.getRepository(Exhibition);
                const boothTemplateRepository =
                    manager.getRepository(BoothTemplate);
                const liveStreamRepository = manager.getRepository(LiveStream);
                const boothImageRepository = manager.getRepository(BoothImage);
                const boothVideoRepository = manager.getRepository(BoothVideo);
                const boothProjectRepository =
                    manager.getRepository(BoothProject);
                const boothProductRepository =
                    manager.getRepository(BoothProduct);
                const boothTemplatePositionRepository = manager.getRepository(
                    BoothTemplatePosition,
                );
                const imageRepository = manager.getRepository(Image);
                const videoRepository = manager.getRepository(Video);
                const projectRepository = manager.getRepository(Project);
                const productRepository = manager.getRepository(Product);

                const firstLocation = await this.getLocationById(
                    boothDto.location_id,
                    locationRepository,
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

                const boothEntity = new Booth();

                boothEntity.createdBy = 1; // TODO: handle getUserId from access token
                boothEntity.exhibition = firstExhibition;
                boothEntity.boothTemplate = firstBoothTemplate;
                boothEntity.location = firstLocation;
                boothEntity.enterpriseId = enterpriseId;

                const createdBooth = await boothRepository.save(boothEntity);

                const createdLiveStreams = await this.createLiveStream(
                    boothDto.live_streams,
                    createdBooth,
                    liveStreamRepository,
                );

                const createdBoothImages = await this.createBoothImages(
                    boothDto.booth_images,
                    createdBooth,
                    boothImageRepository,
                    imageRepository,
                    boothTemplatePositionRepository,
                );

                const createdBoothVideos = await this.createBoothVideos(
                    boothDto.booth_videos,
                    createdBooth,
                    boothVideoRepository,
                    videoRepository,
                    boothTemplatePositionRepository,
                );

                const createdBoothProjects = await this.createBoothProjects(
                    boothDto.booth_projects,
                    createdBooth,
                    boothProjectRepository,
                    projectRepository,
                    boothTemplatePositionRepository,
                );
                const createdBoothProducts = await this.createBoothProducts(
                    boothDto.booth_products,
                    createdBooth,
                    boothProductRepository,
                    productRepository,
                    boothTemplatePositionRepository,
                );

                createdBooth.liveStreams = createdLiveStreams;
                createdBooth.boothImages = createdBoothImages;
                createdBooth.boothVideos = createdBoothVideos;
                createdBooth.boothProjects = createdBoothProjects;
                createdBooth.boothProducts = createdBoothProducts;

                return createdBooth;
            },
        );

        return this.boothConverter.toDto(createdBooth);
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
                    manager.getRepository(Location);
                const exhibitionRepository = manager.getRepository(Exhibition);
                const boothTemplateRepository =
                    manager.getRepository(BoothTemplate);
                const liveStreamRepository = manager.getRepository(LiveStream);
                const projectRepository = manager.getRepository(Project);
                const productRepository = manager.getRepository(Product);
                const boothTemplatePositionRepository = manager.getRepository(
                    BoothTemplatePosition,
                );
                const boothProjectRepository =
                    manager.getRepository(BoothProject);
                const boothProductRepository =
                    manager.getRepository(BoothProduct);
                const boothVideoRepository = manager.getRepository(BoothVideo);
                const boothImageRepository = manager.getRepository(BoothImage);
                const imageRepository = manager.getRepository(Image);
                const videoRepository = manager.getRepository(Video);

                const firstExhibition = await this.getExhibitionById(
                    parseInt(exhibitionId),
                    exhibitionRepository,
                );

                const boothEntity = await boothRepository.findOne({
                    where: {
                        id: parseInt(boothId),
                    },
                    relations: [
                        'liveStreams',
                        'boothTemplate',
                        'boothProducts',
                        'boothProjects',
                        'boothImages',
                        'boothVideos',
                        'location',
                    ],
                });
                if (!boothEntity) {
                    throw new NotFoundException(
                        `The 'booth_id' ${boothId} is not found`,
                    );
                }

                const firstLocation = await this.getLocationById(
                    boothDto.location_id,
                    locationStatusRepository,
                );
                const enterpriseId = await this.getEnterpriseById(
                    boothDto.enterprise_id,
                );
                const firstBoothTemplate = await this.getBoothTemplateById(
                    boothDto.booth_template_id,
                    boothTemplateRepository,
                );

                boothEntity.createdBy = 1; // TODO: handle getUserId from access token
                boothEntity.exhibition = firstExhibition;
                boothEntity.boothTemplate = firstBoothTemplate;
                boothEntity.location = firstLocation;
                boothEntity.enterpriseId = enterpriseId;

                await this.removeOldBoothRelations(
                    boothEntity,
                    boothProjectRepository,
                    boothProductRepository,
                    boothImageRepository,
                    boothVideoRepository,
                    liveStreamRepository,
                    projectRepository,
                    productRepository,
                    imageRepository,
                    videoRepository,
                );

                const createdBooth = await boothRepository.save(boothEntity);
                if (boothDto.live_streams) {
                    const createdLiveStreams = await this.createLiveStream(
                        boothDto.live_streams,
                        createdBooth,
                        liveStreamRepository,
                    );
                    createdBooth.liveStreams = createdLiveStreams;
                }

                let createdBoothProduct = null;
                let createdBoothProject = null;
                let createdBoothImage = null;
                let createdBoothVideo = null;

                if (boothDto.booth_products) {
                    createdBoothProduct = await this.createBoothProducts(
                        boothDto.booth_products,
                        createdBooth,
                        boothProductRepository,
                        productRepository,
                        boothTemplatePositionRepository,
                    );
                    createdBooth.boothProducts = createdBoothProduct;
                }

                if (boothDto.booth_projects) {
                    createdBoothProject = await this.createBoothProjects(
                        boothDto.booth_projects,
                        createdBooth,
                        boothProjectRepository,
                        projectRepository,
                        boothTemplatePositionRepository,
                    );
                    createdBooth.boothProjects = createdBoothProject;
                }

                if (boothDto.booth_images) {
                    createdBoothImage = await this.createBoothImages(
                        boothDto.booth_images,
                        createdBooth,
                        boothImageRepository,
                        imageRepository,
                        boothTemplatePositionRepository,
                    );
                    createdBooth.boothImages = createdBoothImage;
                }

                if (boothDto.booth_videos) {
                    createdBoothVideo = await this.createBoothVideos(
                        boothDto.booth_videos,
                        createdBooth,
                        boothVideoRepository,
                        videoRepository,
                        boothTemplatePositionRepository,
                    );
                    createdBooth.boothVideos = createdBoothVideo;
                }
                return createdBooth;
            },
        );

        return this.boothConverter.toDto(updatedBooth);
    }
}
