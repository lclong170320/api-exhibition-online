import { Injectable } from '@nestjs/common';
import { Document } from '@/components/enterprise/entities/document.entity';
import { EnterpriseDocument as DocumentDto } from '@/components/enterprise/dto/enterprise-document.dto';

@Injectable()
export class DocumentConverter {
    toEntity(dto: DocumentDto) {
        const entity = {
            title: dto.title,
            content: dto.content,
        } as Document;
        return entity;
    }
}
