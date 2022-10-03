import { DbConnection } from '@/database/config/db';
import { Enterprise } from './entities/enterprise.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { EnterpriseDocument as NewDocumentDto } from './dto/enterprise-document.dto';
import { EnterpriseProfile as NewProfileDto } from './dto/enterprise-profile.dto';
import { Enterprise as EnterpriseDto } from './dto/enterprise.dto';
import { Document } from './entities/document.entity';
import { Profile } from './entities/profile.entity';
import { lastValueFrom, map } from 'rxjs';
import { DocumentConverter } from './converters/enterprise-document.converter';
import { ProfileConverter } from './converters/enterprise-profile.converter';
import { toDataURL } from 'qrcode';
import { EnterpriseConverter } from './converters/enterprise.converter';
import { EnterpriseListConverter } from './converters/enterprise-list.converter';

@Injectable()
export class EnterpriseService {
    private readonly offsetDefault = 0;
    private readonly limitDefault = 10;
    constructor(
        @InjectRepository(Enterprise, DbConnection.enterpriseCon)
        private readonly enterpriseRepository: Repository<Enterprise>,
        @InjectRepository(Document, DbConnection.enterpriseCon)
        private readonly documentRepository: Repository<Document>,
        @InjectRepository(Profile, DbConnection.enterpriseCon)
        private readonly profileRepository: Repository<Profile>,
        private readonly httpService: HttpService,
        private readonly documentConverter: DocumentConverter,
        private readonly profileConverter: ProfileConverter,
        private readonly enterpriseConverter: EnterpriseConverter,
        private readonly enterpriseListConverter: EnterpriseListConverter,
    ) {}

    async getEnterprises(offset: string, limit: string) {
        const offsetQuery = parseInt(offset)
            ? parseInt(offset)
            : this.offsetDefault;
        const limitQuery = parseInt(limit)
            ? parseInt(limit)
            : this.limitDefault;
        const [enterprisesEntity, count] =
            await this.enterpriseRepository.findAndCount({
                order: {
                    createdAt: 'DESC',
                },
                skip: offsetQuery,
                take: limitQuery,
            });
        return this.enterpriseListConverter.toDto(
            enterprisesEntity,
            limitQuery,
            offsetQuery,
            count,
        );
    }
    async getEnterpriseById(id: string) {
        const enterpriseEntity = await this.findEnterpriseById(id);
        return this.enterpriseConverter.toDto(enterpriseEntity);
    }

    async createEnterprise(
        enterpriseDto: EnterpriseDto,
    ): Promise<EnterpriseDto> {
        //TODO
        const user_id = 1;
        const newEnterpriseEntity =
            this.enterpriseConverter.toEntity(enterpriseDto);
        newEnterpriseEntity.createdDate = new Date();

        newEnterpriseEntity.createdBy = user_id;
        const createdEnterprise = await this.enterpriseRepository.save(
            newEnterpriseEntity,
        );

        return this.enterpriseConverter.toDto(createdEnterprise);
    }

    async createUrlMedias(data: Blob): Promise<string> {
        const requestConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const url = 'http://localhost:3000/api/v1/medias';

        const media = this.httpService.post(url, { data }, requestConfig);

        const response = media.pipe(
            map((res) => {
                return res.data;
            }),
        );

        const result = await lastValueFrom(response);
        return result;
    }

    async createDocument(
        id: string,
        newDocumentDto: NewDocumentDto,
    ): Promise<object> {
        const newDocumentEntity =
            this.documentConverter.toEntity(newDocumentDto);

        const medias = await Promise.all(
            newDocumentDto.medias.map(async (media) => {
                return await this.createUrlMedias(media);
            }),
        );

        newDocumentEntity.medias = medias;
        newDocumentEntity.enterpriseId = parseInt(id);

        const documentToCreate =
            this.documentRepository.create(newDocumentEntity);

        const documentToSave = await this.documentRepository.save(
            documentToCreate,
        );

        return { id: documentToSave.id };
    }

    async createProfile(
        id: string,
        newProfileDto: NewProfileDto,
    ): Promise<object> {
        const newProfileEntity = this.profileConverter.toEntity(newProfileDto);

        newProfileEntity.enterpriseId = parseInt(id);

        const profileToCreate = this.profileRepository.create(newProfileEntity);

        const profileToSave = await this.profileRepository.save(
            profileToCreate,
        );

        return { id: profileToSave.id };
    }

    async generateQR(text: string): Promise<string> {
        return await toDataURL(text);
    }

    async createQrCode(id: string): Promise<object> {
        const url = `${process.env.CLIENT_HOST}enterprises/${id}/profiles`;
        const qrcode = await this.generateQR(url);
        return { qrcode: qrcode };
    }

    private async findEnterpriseById(id: string) {
        const enterpriseId = parseInt(id);
        const enterpriseEntity = await this.enterpriseRepository.findOneBy({
            id: enterpriseId,
        });
        if (!enterpriseEntity) {
            throw new NotFoundException('The id not exist: ' + enterpriseId);
        }
        return enterpriseEntity;
    }

    async updateEnterprise(id: string, newEnterpriseDto: EnterpriseDto) {
        const enterpriseEntity = await this.findEnterpriseById(id);
        const newEnterpriseEntity =
            this.enterpriseConverter.toEntity(newEnterpriseDto);
        const newEnterprise = await this.enterpriseRepository.save({
            ...enterpriseEntity,
            ...newEnterpriseEntity,
        });
        return this.enterpriseConverter.toDto(newEnterprise);
    }

    async deleteEnterprise(id: string) {
        const enterpriseId = parseInt(id);
        const deleteResponse = await this.enterpriseRepository.softDelete(
            enterpriseId,
        );
        if (!deleteResponse.affected) {
            throw new NotFoundException('The id not exist: ');
        }
    }
}
