import { DbConnection } from '@/database/config/db';
import { HttpService } from '@nestjs/axios';
import {
    BadRequestException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { lastValueFrom, map } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { BoothOrganization as BoothOrganizationDto } from '@/components/exhibition/dto/booth-organization.dto';
import { BoothOrganization } from '@/components/exhibition/entities/booth-organization.entity';
import { ConfigService } from '@nestjs/config';
import { BoothOrganizationTemplate } from '../entities/booth-organization-template.entity';
import { BoothOrganizationImage } from '../entities/booth-organization-image.entity';
import { BoothOrganizationImage as BoothOrganizationImageDto } from '@/components/exhibition/dto/booth-organization-image.dto';
import { BoothOrganizationVideo as BoothOrganizationVideoDto } from '@/components/exhibition/dto/booth-organization-video.dto';
import { BoothOrganizationProject as BoothOrganizationProjectDto } from '@/components/exhibition/dto/booth-organization-project.dto';
import { BoothOrganizationProduct as BoothOrganizationProductDto } from '@/components/exhibition/dto/booth-organization-product.dto';
import { BoothOrganizationVideo } from '../entities/booth-organization-video.entity';
import { BoothOrganizationProject } from '../entities/booth-organization-project.entity';
import { BoothOrganizationProduct } from '../entities/booth-organization-product.entity';
import { BoothOrganizationTemplatePosition } from '../entities/booth-organization-template-position.entity';
import { Image } from '../entities/image.entity';
import { Video } from '../entities/video.entity';
import { Project } from '../entities/project.entity';
import { Product } from '../entities/product.entity';
import { BoothOrganizationConverter } from '../converters/booth-organization.converter';

@Injectable()
export class BoothOrganizationService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly boothOrganizationConverter: BoothOrganizationConverter,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async getBoothOrganizationById(
        boothOrganizationId: string,
        populate: string[],
    ): Promise<BoothOrganizationDto> {
        const allowPopulate = [
            'boothOrganizationTemplate',
            'boothOrganizationTemplate.boothOrganizationTemplatePositions',
            'boothOrganizationProducts.product',
            'boothOrganizationProjects.project',
            'boothOrganizationVideos.video',
            'boothOrganizationImages.image',
            'boothOrganizationProducts.boothOrganizationTemplatePosition',
            'boothOrganizationProjects.boothOrganizationTemplatePosition',
            'boothOrganizationVideos.boothOrganizationTemplatePosition',
            'boothOrganizationImages.boothOrganizationTemplatePosition',
        ];

        populate.forEach((value) => {
            if (!allowPopulate.includes(value)) {
                throw new BadRequestException(
                    'Query value is not allowed ' + value,
                );
            }
        });

        const boothOrganizationRepository =
            this.dataSource.getRepository(BoothOrganization);

        const firstBoothOrganization =
            await boothOrganizationRepository.findOne({
                where: {
                    id: parseInt(boothOrganizationId),
                },
                relations: populate,
            });

        if (!firstBoothOrganization) {
            throw new NotFoundException(
                `The 'booth_organization_id' ${boothOrganizationId} is not found`,
            );
        }
        return this.boothOrganizationConverter.toDto(firstBoothOrganization);
    }

    async updateBoothOrganization(
        boothOrganizationId: string,
        boothOrganizationDto: BoothOrganizationDto,
    ) {
        const updatedBoothOrganization = await this.dataSource.transaction(
            async (manager) => {
                const boothOrganizationRepository =
                    manager.getRepository(BoothOrganization);
                const boothOrganizationTemplateRepository =
                    manager.getRepository(BoothOrganizationTemplate);
                const boothOrganizationImageRepository = manager.getRepository(
                    BoothOrganizationImage,
                );
                const boothOrganizationVideoRepository = manager.getRepository(
                    BoothOrganizationVideo,
                );
                const boothOrganizationProjectRepository =
                    manager.getRepository(BoothOrganizationProject);
                const boothOrganizationProductRepository =
                    manager.getRepository(BoothOrganizationProduct);
                const boothOrganizationTemplatePositionRepository =
                    manager.getRepository(BoothOrganizationTemplatePosition);
                const imageRepository = manager.getRepository(Image);
                const videoRepository = manager.getRepository(Video);
                const projectRepository = manager.getRepository(Project);
                const productRepository = manager.getRepository(Product);

                const boothOrganizationEntity =
                    await boothOrganizationRepository.findOne({
                        where: {
                            id: parseInt(boothOrganizationId),
                        },
                    });

                if (!boothOrganizationEntity) {
                    throw new NotFoundException(
                        `The 'booth_organization_id' ${boothOrganizationId} is not found`,
                    );
                }

                const firstBoothOrganizationTemplate =
                    await boothOrganizationTemplateRepository.findOneBy({
                        id: boothOrganizationDto.booth_organization_template_id,
                    });

                boothOrganizationEntity.boothOrganizationTemplate =
                    firstBoothOrganizationTemplate;

                await this.removeBoothOrganizationRelations(
                    boothOrganizationEntity,
                    boothOrganizationImageRepository,
                    boothOrganizationVideoRepository,
                    boothOrganizationProjectRepository,
                    boothOrganizationProductRepository,
                    imageRepository,
                    videoRepository,
                    projectRepository,
                    productRepository,
                );

                const updatedBoothOrganization =
                    await boothOrganizationRepository.save(
                        boothOrganizationEntity,
                    );

                await this.createMultipleBoothOrganizationImage(
                    boothOrganizationDto,
                    boothOrganizationEntity,
                    boothOrganizationImageRepository,
                    boothOrganizationTemplatePositionRepository,
                    imageRepository,
                );

                await this.createMultipleBoothOrganizationVideo(
                    boothOrganizationDto,
                    boothOrganizationEntity,
                    boothOrganizationVideoRepository,
                    boothOrganizationTemplatePositionRepository,
                    videoRepository,
                );

                await this.createMultipleBoothOrganizationProduct(
                    boothOrganizationDto,
                    boothOrganizationEntity,
                    boothOrganizationProductRepository,
                    boothOrganizationTemplatePositionRepository,
                    productRepository,
                );

                await this.createMultipleBoothOrganizationProject(
                    boothOrganizationDto,
                    boothOrganizationEntity,
                    boothOrganizationProjectRepository,
                    boothOrganizationTemplatePositionRepository,
                    projectRepository,
                );

                return updatedBoothOrganization;
            },
        );
        return this.boothOrganizationConverter.toDto(updatedBoothOrganization);
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

    private async createMultipleBoothOrganizationImage(
        boothOrganizationDto: BoothOrganizationDto,
        boothOrganization: BoothOrganization,
        boothOrganizationImageRepository: Repository<BoothOrganizationImage>,
        boothOrganizationTemplatePositionRepository: Repository<BoothOrganizationTemplatePosition>,
        imageRepository: Repository<Image>,
    ) {
        let boothOrganizationImages = [];
        if (boothOrganizationDto.booth_organization_images) {
            boothOrganizationImages = await Promise.all(
                boothOrganizationDto.booth_organization_images.map(
                    async (boothOrganizationImage) => {
                        const createdBoothOrganizationImage =
                            await this.createBoothOrganizationImage(
                                boothOrganizationImage,
                                boothOrganization,
                                boothOrganizationImageRepository,
                                imageRepository,
                                boothOrganizationTemplatePositionRepository,
                            );
                        return createdBoothOrganizationImage;
                    },
                ),
            );
        }

        return boothOrganizationImages;
    }

    private async createMultipleBoothOrganizationVideo(
        boothOrganizationDto: BoothOrganizationDto,
        boothOrganization: BoothOrganization,
        boothOrganizationVideoRepository: Repository<BoothOrganizationVideo>,
        boothOrganizationTemplatePositionRepository: Repository<BoothOrganizationTemplatePosition>,
        videoRepository: Repository<Video>,
    ) {
        let boothOrganizationVideos = [];
        if (boothOrganizationDto.booth_organization_videos) {
            boothOrganizationVideos = await Promise.all(
                boothOrganizationDto.booth_organization_videos.map(
                    async (boothOrganizationVideo) => {
                        const createdBoothOrganizationVideo =
                            await this.createBoothOrganizationVideo(
                                boothOrganizationVideo,
                                boothOrganization,
                                boothOrganizationVideoRepository,
                                videoRepository,
                                boothOrganizationTemplatePositionRepository,
                            );
                        return createdBoothOrganizationVideo;
                    },
                ),
            );
        }

        return boothOrganizationVideos;
    }

    private async createMultipleBoothOrganizationProject(
        boothOrganizationDto: BoothOrganizationDto,
        boothOrganization: BoothOrganization,
        boothOrganizationProjectRepository: Repository<BoothOrganizationProject>,
        boothOrganizationTemplatePositionRepository: Repository<BoothOrganizationTemplatePosition>,
        projectRepository: Repository<Project>,
    ) {
        let boothOrganizationProjects = [];
        if (boothOrganizationDto.booth_organization_projects) {
            boothOrganizationProjects = await Promise.all(
                boothOrganizationDto.booth_organization_projects.map(
                    async (boothOrganizationVideo) => {
                        const createdBoothOrganizationProject =
                            await this.createBoothOrganizationProject(
                                boothOrganizationVideo,
                                boothOrganization,
                                boothOrganizationProjectRepository,
                                projectRepository,
                                boothOrganizationTemplatePositionRepository,
                            );
                        return createdBoothOrganizationProject;
                    },
                ),
            );
        }

        return boothOrganizationProjects;
    }

    private async createMultipleBoothOrganizationProduct(
        boothOrganizationDto: BoothOrganizationDto,
        boothOrganization: BoothOrganization,
        boothOrganizationProductRepository: Repository<BoothOrganizationProduct>,
        boothOrganizationTemplatePositionRepository: Repository<BoothOrganizationTemplatePosition>,
        productRepository: Repository<Product>,
    ) {
        let boothOrganizationProducts = [];
        if (boothOrganizationDto.booth_organization_products) {
            boothOrganizationProducts = await Promise.all(
                boothOrganizationDto.booth_organization_products.map(
                    async (boothOrganizationProduct) => {
                        const createdBoothOrganizationProduct =
                            await this.createBoothOrganizationProduct(
                                boothOrganizationProduct,
                                boothOrganization,
                                boothOrganizationProductRepository,
                                productRepository,
                                boothOrganizationTemplatePositionRepository,
                            );
                        return createdBoothOrganizationProduct;
                    },
                ),
            );
        }

        return boothOrganizationProducts;
    }

    private async removeBoothOrganizationRelations(
        boothOrganization: BoothOrganization,
        boothOrganizationImageRepository: Repository<BoothOrganizationImage>,
        boothOrganizationVideoRepository: Repository<BoothOrganizationVideo>,
        boothOrganizationProjectRepository: Repository<BoothOrganizationProject>,
        boothOrganizationProductRepository: Repository<BoothOrganizationProduct>,
        imageRepository: Repository<Image>,
        videoRepository: Repository<Video>,
        projectRepository: Repository<Project>,
        productRepository: Repository<Product>,
    ) {
        const boothOrganizationImages =
            await boothOrganizationImageRepository.find({
                where: {
                    boothOrganization: {
                        id: boothOrganization.id,
                    },
                },
            });
        if (boothOrganizationImages) {
            await Promise.all(
                boothOrganizationImages.map(async (boothOrganizationImage) => {
                    this.removeBoothOrganizationImage(
                        boothOrganizationImage,
                        boothOrganizationImageRepository,
                        imageRepository,
                    );
                }),
            );
        }
        const boothOrganizationVideos =
            await boothOrganizationVideoRepository.find({
                where: {
                    boothOrganization: {
                        id: boothOrganization.id,
                    },
                },
            });
        if (boothOrganizationVideos) {
            await Promise.all(
                boothOrganizationVideos.map(async (boothOrganizationVideo) => {
                    this.removeBoothOrganizationVideo(
                        boothOrganizationVideo,
                        boothOrganizationVideoRepository,
                        videoRepository,
                    );
                }),
            );
        }
        const boothOrganizationProjects =
            await boothOrganizationProjectRepository.find({
                where: {
                    boothOrganization: {
                        id: boothOrganization.id,
                    },
                },
            });
        if (boothOrganizationProjects) {
            await Promise.all(
                boothOrganizationProjects.map(
                    async (boothOrganizationProject) => {
                        this.removeBoothOrganizationProject(
                            boothOrganizationProject,
                            boothOrganizationProjectRepository,
                            projectRepository,
                        );
                    },
                ),
            );
        }
        const boothOrganizationProducts =
            await boothOrganizationProductRepository.find({
                where: {
                    boothOrganization: {
                        id: boothOrganization.id,
                    },
                },
            });
        if (boothOrganizationProducts) {
            await Promise.all(
                boothOrganizationProducts.map(
                    async (boothOrganizationProduct) => {
                        this.removeBoothOrganizationProduct(
                            boothOrganizationProduct,
                            boothOrganizationProductRepository,
                            productRepository,
                        );
                    },
                ),
            );
        }

        return boothOrganization;
    }

    private async removeBoothOrganizationImage(
        boothOrganizationImage: BoothOrganizationImage,
        boothOrganizationImageRepository: Repository<BoothOrganizationImage>,
        imageRepository: Repository<Image>,
    ) {
        const firstBoothOrganizationImage =
            await boothOrganizationImageRepository.findOne({
                where: {
                    id: boothOrganizationImage.id,
                },
                relations: ['image'],
            });
        if (!firstBoothOrganizationImage) {
            throw new BadRequestException(
                `The booth_image_id '${boothOrganizationImage.id}' is not found`,
            );
        }
        await boothOrganizationImageRepository.remove(boothOrganizationImage);

        await imageRepository.remove(firstBoothOrganizationImage.image);
    }

    private async removeBoothOrganizationVideo(
        boothOrganizationVideo: BoothOrganizationVideo,
        boothOrganizationVideoRepository: Repository<BoothOrganizationVideo>,
        videoRepository: Repository<Video>,
    ) {
        const firstBoothOrganizationVideo =
            await boothOrganizationVideoRepository.findOne({
                where: {
                    id: boothOrganizationVideo.id,
                },
                relations: ['video'],
            });
        if (!firstBoothOrganizationVideo) {
            throw new BadRequestException(
                `The booth_image_id '${boothOrganizationVideo.id}' is not found`,
            );
        }
        await boothOrganizationVideoRepository.remove(boothOrganizationVideo);
        await videoRepository.remove(firstBoothOrganizationVideo.video);
    }

    private async removeBoothOrganizationProject(
        boothOrganizationProject: BoothOrganizationProject,
        boothOrganizationProjectRepository: Repository<BoothOrganizationProject>,
        projectRepository: Repository<Project>,
    ) {
        const firstBoothOrganizationProject =
            await boothOrganizationProjectRepository.findOne({
                where: {
                    id: boothOrganizationProject.id,
                },
                relations: ['project'],
            });
        if (!firstBoothOrganizationProject) {
            throw new BadRequestException(
                `The booth_organization_id '${boothOrganizationProject.id}' is not found`,
            );
        }
        await boothOrganizationProjectRepository.remove(
            boothOrganizationProject,
        );
        await projectRepository.remove(firstBoothOrganizationProject.project);
    }

    private async removeBoothOrganizationProduct(
        boothOrganizationProduct: BoothOrganizationProduct,
        boothOrganizationProductRepository: Repository<BoothOrganizationProduct>,
        productRepository: Repository<Product>,
    ) {
        const firstBoothOrganizationProduct =
            await boothOrganizationProductRepository.findOne({
                where: {
                    id: boothOrganizationProduct.id,
                },
                relations: ['product'],
            });
        await boothOrganizationProductRepository.remove(
            boothOrganizationProduct,
        );
        if (!firstBoothOrganizationProduct) {
            throw new BadRequestException(
                `The booth_image_id '${boothOrganizationProduct.id}' is not found`,
            );
        }
        await productRepository.remove(firstBoothOrganizationProduct.product);
    }

    private async createBoothOrganizationImage(
        boothOrganizationImageDto: BoothOrganizationImageDto,
        boothOrganization: BoothOrganization,
        boothOrganizationImageRepository: Repository<BoothOrganizationImage>,
        imageRepository: Repository<Image>,
        boothOrganizationTemplatePositionRepository: Repository<BoothOrganizationTemplatePosition>,
    ) {
        const firstBoothOrganizationTemplatePosition =
            await boothOrganizationTemplatePositionRepository.findOneBy({
                id: boothOrganizationImageDto.booth_organization_template_position_id,
            });

        if (!firstBoothOrganizationTemplatePosition) {
            throw new BadRequestException(
                `The booth_organization_template_position_id ${boothOrganizationImageDto.booth_organization_template_position_id}`,
            );
        }

        const imageEntity = new Image();
        imageEntity.imageId = boothOrganizationImageDto.image_id;

        if (boothOrganizationImageDto.media_data) {
            imageEntity.imageId = await this.createUrlMedias(
                boothOrganizationImageDto.media_data,
            );
        }

        const createdImage = await imageRepository.save(imageEntity);

        const boothOrganizationImageEntity = new BoothOrganizationImage();

        boothOrganizationImageEntity.image = createdImage;
        boothOrganizationImageEntity.boothOrganization = boothOrganization;
        boothOrganizationImageEntity.boothOrganizationTemplatePosition =
            firstBoothOrganizationTemplatePosition;

        const createdBoothOrganizationImage =
            await boothOrganizationImageRepository.save(
                boothOrganizationImageEntity,
            );

        return createdBoothOrganizationImage;
    }

    private async createBoothOrganizationVideo(
        boothOrganizationVideoDto: BoothOrganizationVideoDto,
        boothOrganization: BoothOrganization,
        boothOrganizationVideoRepository: Repository<BoothOrganizationVideo>,
        videoRepository: Repository<Video>,
        boothOrganizationTemplatePositionRepository: Repository<BoothOrganizationTemplatePosition>,
    ) {
        const firstBoothOrganizationTemplatePosition =
            await boothOrganizationTemplatePositionRepository.findOneBy({
                id: boothOrganizationVideoDto.booth_organization_template_position_id,
            });

        if (!firstBoothOrganizationTemplatePosition) {
            throw new BadRequestException(
                `The booth_organization_template_position_id ${boothOrganizationVideoDto.booth_organization_template_position_id}`,
            );
        }

        const videoEntity = new Video();
        videoEntity.videoId = boothOrganizationVideoDto.video_id;

        if (boothOrganizationVideoDto.media_data) {
            videoEntity.videoId = await this.createUrlMedias(
                boothOrganizationVideoDto.media_data,
            );
        }

        const createdVideo = await videoRepository.save(videoEntity);

        const boothOrganizationVideoEntity = new BoothOrganizationVideo();

        boothOrganizationVideoEntity.video = createdVideo;
        boothOrganizationVideoEntity.boothOrganization = boothOrganization;
        boothOrganizationVideoEntity.boothOrganizationTemplatePosition =
            firstBoothOrganizationTemplatePosition;

        const createdBoothOrganizationVideo =
            await boothOrganizationVideoRepository.save(
                boothOrganizationVideoEntity,
            );

        return createdBoothOrganizationVideo;
    }

    private async createBoothOrganizationProject(
        boothOrganizationProjectDto: BoothOrganizationProjectDto,
        boothOrganization: BoothOrganization,
        boothOrganizationProjectRepository: Repository<BoothOrganizationProject>,
        projectRepository: Repository<Project>,
        boothOrganizationTemplatePositionRepository: Repository<BoothOrganizationTemplatePosition>,
    ) {
        const firstBoothOrganizationTemplatePosition =
            await boothOrganizationTemplatePositionRepository.findOneBy({
                id: boothOrganizationProjectDto.booth_organization_template_position_id,
            });

        if (!firstBoothOrganizationTemplatePosition) {
            throw new BadRequestException(
                `The booth_organization_template_position_id ${boothOrganizationProjectDto.booth_organization_template_position_id}`,
            );
        }

        const projectEntity = new Project();
        projectEntity.imageId = boothOrganizationProjectDto.selected_media_id;
        projectEntity.title = boothOrganizationProjectDto.title;
        projectEntity.description = boothOrganizationProjectDto.description;

        if (boothOrganizationProjectDto.media_data) {
            projectEntity.imageId = await this.createUrlMedias(
                boothOrganizationProjectDto.media_data,
            );
        }

        const createdProject = await projectRepository.save(projectEntity);

        const boothOrganizationVideoEntity = new BoothOrganizationProject();

        boothOrganizationVideoEntity.project = createdProject;
        boothOrganizationVideoEntity.boothOrganization = boothOrganization;
        boothOrganizationVideoEntity.boothOrganizationTemplatePosition =
            firstBoothOrganizationTemplatePosition;

        const createdBoothOrganizationProject =
            await boothOrganizationProjectRepository.save(
                boothOrganizationVideoEntity,
            );

        return createdBoothOrganizationProject;
    }

    private async createBoothOrganizationProduct(
        boothOrganizationProductDto: BoothOrganizationProductDto,
        boothOrganization: BoothOrganization,
        boothOrganizationProductRepository: Repository<BoothOrganizationProduct>,
        productRepository: Repository<Product>,
        boothOrganizationTemplatePositionRepository: Repository<BoothOrganizationTemplatePosition>,
    ) {
        const firstBoothOrganizationTemplatePosition =
            await boothOrganizationTemplatePositionRepository.findOneBy({
                id: boothOrganizationProductDto.booth_organization_template_position_id,
            });

        if (!firstBoothOrganizationTemplatePosition) {
            throw new BadRequestException(
                `The booth_organization_template_position_id ${boothOrganizationProductDto.booth_organization_template_position_id}`,
            );
        }

        const productEntity = new Product();
        productEntity.imageId = boothOrganizationProductDto.selected_media_id;
        productEntity.name = boothOrganizationProductDto.name;
        productEntity.price = boothOrganizationProductDto.price;
        productEntity.purchaseLink = boothOrganizationProductDto.purchase_link;
        productEntity.description = boothOrganizationProductDto.description;

        if (boothOrganizationProductDto.media_data) {
            productEntity.imageId = await this.createUrlMedias(
                boothOrganizationProductDto.media_data,
            );
        }

        const createdProduct = await productRepository.save(productEntity);

        const boothOrganizationProductEntity = new BoothOrganizationProduct();

        boothOrganizationProductEntity.product = createdProduct;
        boothOrganizationProductEntity.boothOrganization = boothOrganization;
        boothOrganizationProductEntity.boothOrganizationTemplatePosition =
            firstBoothOrganizationTemplatePosition;

        const createdBoothOrganizationProduct =
            await boothOrganizationProductRepository.save(
                boothOrganizationProductEntity,
            );

        return createdBoothOrganizationProduct;
    }
}
