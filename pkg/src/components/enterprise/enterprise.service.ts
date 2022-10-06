import { DbConnection } from '@/database/config/db';
import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { toDataURL } from 'qrcode';
import { lastValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';
import { DocumentListConverter } from './converters/document-list.converter';
import { DocumentConverter } from './converters/enterprise-document.converter';
import { EnterpriseListConverter } from './converters/enterprise-list.converter';
import { EnterpriseConverter } from './converters/enterprise.converter';
import { EnterpriseDocument as NewDocumentDto } from './dto/enterprise-document.dto';
import { EnterpriseQuery } from './dto/enterprise-query.dto';
import { Enterprise as EnterpriseDto } from './dto/enterprise.dto';
import {
    ALLOWED_SORT_COLUMNS,
    EnterpriseRepository,
} from './enterprise.repository';
import { Document } from './entities/document.entity';

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
        private readonly documentConverter: DocumentConverter,
        private readonly enterpriseConverter: EnterpriseConverter,
        private readonly enterpriseListConverter: EnterpriseListConverter,
        private readonly documentListConverter: DocumentListConverter,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
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

    async getEnterprisesDocuments(id: string, offset: string, limit: string) {
        const enterpriseId = parseInt(id);
        const offsetQuery = parseInt(offset)
            ? parseInt(offset)
            : this.offsetDefault;
        const limitQuery = parseInt(limit)
            ? parseInt(limit)
            : this.limitDefault;
        const [enterprisesDocumentEntity, count] =
            await this.documentRepository.findAndCount({
                where: {
                    enterpriseId: enterpriseId,
                },
                order: {
                    createdAt: 'DESC',
                },
                skip: offsetQuery,
                take: limitQuery,
            });
        return this.documentListConverter.toDto(
            enterprisesDocumentEntity,
            limitQuery,
            offsetQuery,
            count,
        );
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

    async createUrlMedias(data: string): Promise<number> {
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

    async createDocument(
        id: string,
        newDocumentDto: NewDocumentDto,
    ): Promise<object> {
        const newDocumentEntity =
            this.documentConverter.toEntity(newDocumentDto);

        newDocumentEntity.mediaId = newDocumentDto.selected_media_id;

        if (newDocumentDto.media_data) {
            newDocumentEntity.mediaId = await this.createUrlMedias(
                newDocumentDto.media_data,
            );
        }
        newDocumentEntity.enterpriseId = parseInt(id);

        const documentToCreate =
            this.documentRepository.create(newDocumentEntity);

        const documentToSave = await this.documentRepository.save(
            documentToCreate,
        );

        return this.documentConverter.toDto(documentToSave);
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
            throw new NotFoundException(
                'The id enterprise not exist: ' + enterpriseId,
            );
        }
        return enterpriseEntity;
    }

    private async findDocumentById(id: string, enterpriseId: string) {
        const documentEntity = await this.documentRepository.findOneBy({
            id: parseInt(id),
            enterpriseId: parseInt(enterpriseId),
        });
        if (!documentEntity) {
            throw new NotFoundException(
                `The document with enterprise id: ${enterpriseId}, document not exist with document id: ${id}`,
            );
        }
        return documentEntity;
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
