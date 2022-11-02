import { DbConnection } from '@/database/config/db';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Booth } from '@/components/exhibition/entities/booth.entity';
import { LocationStatus } from '@/components/exhibition/entities/location-status.entity';
import { LiveStream } from '@/components/exhibition/entities/livestream.entity';
import { Booth as BoothDto } from '@/components/exhibition/dto/booth.dto';
import { LiveStream as LiveStreamDto } from '@/components/exhibition/dto/live-stream.dto';
import { BoothData as BoothDataDto } from '@/components/exhibition/dto/booth-data.dto';
import { Project as ProjectDto } from '@/components/exhibition/dto/project.dto';
import { Product as ProductDto } from '@/components/exhibition/dto/product.dto';
import { lastValueFrom, map } from 'rxjs';
import { LiveStreamConverter } from '@/components/exhibition/converters/live-stream.converter';
import { BoothConverter } from '../converters/booth.converter';
import { Exhibition } from '../entities/exhibition.entity';
import { BoothTemplate } from '../entities/booth-template.entity';
import { BoothData } from '../entities/booth-data.entity';
import { Project } from '../entities/project.entity';
import { Product } from '../entities/product.entity';

import { PositionBooth } from '../entities/position-booth.entity';
import { ProjectConverter } from '../converters/project.converter';
import { ProductConverter } from '../converters/product.converter';

@Injectable()
export class BoothService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly liveStreamConverter: LiveStreamConverter,
        private readonly boothConverter: BoothConverter,
        private readonly projectConverter: ProjectConverter,
        private readonly productConverter: ProductConverter,
    ) {}

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

    async createBooth(boothDto: BoothDto) {
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
                    boothDto.exhibition_id,
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
