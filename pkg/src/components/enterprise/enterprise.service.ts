import { DbConnection } from '@/database/config/db';
import { Enterprise } from './entities/enterprise.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { EnterpriseDocument as NewDocumentDto } from './dto/enterprise-document.dto';
import { EnterpriseProfile as NewProfileDto } from './dto/enterprise-profile.dto';
import { Document } from './entities/document.entity';
import { Profile } from './entities/profile.entity';
import { lastValueFrom, map } from 'rxjs';
import { DocumentConverter } from './converters/enterprise-document.converter';
import { ProfileConverter } from './converters/enterprise-profile.converter';
import { toDataURL } from 'qrcode';

@Injectable()
export class EnterpriseService {
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
        let qrcode: string;
        try {
            qrcode = await toDataURL(text);
        } catch (err) {}
        return qrcode;
    }

    async createQrCode(id: string): Promise<object> {
        const url = `${process.env.CLIENT_HOST}enterprises/${id}/profiles`;
        const qrcode = await this.generateQR(url);
        return { qrcode: qrcode };
    }
}
