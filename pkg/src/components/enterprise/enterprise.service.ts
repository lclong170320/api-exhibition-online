import { DbConnection } from '@/database/config/db';
import { Enterprise } from './entities/enterprise.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { EnterpriseDocument as NewDocumentDto } from './dto/enterprise-document.dto';
import { Document } from './entities/document.entity';
import { lastValueFrom, map } from 'rxjs';
import { DocumentConverter } from './converters/enterprise-document.converter';

@Injectable()
export class EnterpriseService {
    constructor(
        @InjectRepository(Enterprise, DbConnection.enterpriseCon)
        private readonly enterpriseRepository: Repository<Enterprise>,
        @InjectRepository(Document, DbConnection.enterpriseCon)
        private readonly documentRepository: Repository<Document>,
        private readonly httpService: HttpService,
        private readonly documentConverter: DocumentConverter,
    ) {}

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
}
