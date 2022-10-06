import { Injectable } from '@nestjs/common';
import { Document } from '@/components/enterprise/entities/document.entity';
import { EnterpriseDocument as DocumentDto } from '@/components/enterprise/dto/enterprise-document.dto';

@Injectable()
export class DocumentConverter {
    toEntity(dto: DocumentDto) {
        const entity = {
            title: dto.title,
            content: dto.content,
            userId: dto.user_id,
        } as Document;
        return entity;
    }
    toDto(entity: Document) {
        const dto = {
            id: entity.id,
            user_id: entity.userId,
            title: entity.title,
            content: entity.content,
        } as DocumentDto;

        return dto;
    }
}
