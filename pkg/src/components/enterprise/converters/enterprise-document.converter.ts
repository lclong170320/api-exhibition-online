import { Injectable } from '@nestjs/common';
import { Document } from '@/components/enterprise/entities/document.entity';
import { EnterpriseDocument as DocumentDto } from '@/components/enterprise/dto/enterprise-document.dto';

@Injectable()
export class DocumentConverter {
    toEntity(dto: DocumentDto) {
        const entity = {
            title: dto.title,
            content: dto.content,
            isProfile: dto.is_profile,
        } as Document;
        return entity;
    }

    toDto(entity: Document) {
        const dto = {
            id: entity.id,
            title: entity.title,
            content: entity.content,
            is_profile: entity.isProfile,
            media_id: entity.mediaId ?? undefined,
        } as DocumentDto;

        return dto;
    }
}
