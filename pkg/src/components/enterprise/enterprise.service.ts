import { DbConnection } from '@/database/config/db';
import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toDataURL } from 'qrcode';
import { lastValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';
import { DocumentConverter } from './converters/enterprise-document.converter';
import { EnterpriseListConverter } from './converters/enterprise-list.converter';
import { ProfileConverter } from './converters/enterprise-profile.converter';
import { EnterpriseConverter } from './converters/enterprise.converter';
import { EnterpriseDocument as NewDocumentDto } from './dto/enterprise-document.dto';
import { EnterpriseProfile as NewProfileDto } from './dto/enterprise-profile.dto';
import { EnterpriseQuery } from './dto/enterprise-query.dto';
import { Enterprise as EnterpriseDto } from './dto/enterprise.dto';
import {
    ALLOWED_SORT_COLUMNS,
    EnterpriseRepository,
} from './enterprise.repository';
import { Document } from './entities/document.entity';
import { Profile } from './entities/profile.entity';

@Injectable()
export class EnterpriseService {
    private readonly offsetDefault = 0;
    private readonly limitDefault = 10;
    private readonly ascending = 'ASC';
    private readonly descending = 'DESC';
    constructor(
        private readonly enterpriseRepository: EnterpriseRepository,
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

    async getEnterprises(query: EnterpriseQuery) {
        const sortValue = this.parseSort(query.sort);
        if (sortValue.size === 0) {
            sortValue.set('created_at', 'DESC');
        }

        const searchValue = query.search ? query.search : '';

        const offsetValue = query.offset
            ? parseInt(query.offset)
            : this.offsetDefault;
        const limitValue = query.limit
            ? parseInt(query.limit)
            : this.limitDefault;

        //TODO add column search createdBy
        const [enterprisesEntity, count] =
            await this.enterpriseRepository.getEnterprises(
                searchValue,
                limitValue,
                offsetValue,
                sortValue,
            );

        return this.enterpriseListConverter.toDto(
            enterprisesEntity,
            limitValue,
            offsetValue,
            count,
        );
    }

    private parseSort(sortParam: string) {
        const sort: Map<string, string> = new Map();
        if (!sortParam || sortParam.length === 0) {
            return sort;
        }
        sortParam.split(',').map((sortItem) => {
            const [fieldName, ordering] = sortItem.split('-');
            if (
                ALLOWED_SORT_COLUMNS.includes(fieldName) &&
                this.isValidOrdering(ordering)
            ) {
                sort.set(fieldName, ordering.toUpperCase());
            }
        });
        return sort;
    }

    private isValidOrdering(ordering: string) {
        return (
            ordering.toUpperCase() === this.ascending ||
            ordering.toUpperCase() === this.descending
        );
    }

    async getEnterpriseById(id: string) {
        const enterpriseEntity = await this.findEnterpriseById(id);
        return this.enterpriseConverter.toDto(enterpriseEntity);
    }

    async getEnterpriseDocumentById(id: string) {
        const enterpriseDocumentEntity = await this.findEnterpriseDocumentById(
            id,
        );
        return this.documentConverter.toDto(enterpriseDocumentEntity);
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

    private async findEnterpriseDocumentById(id: string) {
        const documentId = parseInt(id);
        const documentEntity = await this.documentRepository.findOneBy({
            id: documentId,
        });
        if (!documentEntity) {
            throw new NotFoundException('The id not exist: ' + documentId);
        }
        return documentEntity;
    }
}
