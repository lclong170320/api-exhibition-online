import { Injectable } from '@nestjs/common';
import { DocumentList } from '../dto/document-list.dto';
import { Document } from '../entities/document.entity';
import { DocumentConverter } from './enterprise-document.converter';

@Injectable()
export class DocumentListConverter {
    constructor(private documentConverter: DocumentConverter) {}
    toDto(entity: Document[], limit: number, offset: number, total: number) {
        const dto = {
            limit: limit,
            offset: offset,
            total: total,
            documents: entity.map((data) => this.documentConverter.toDto(data)),
        } as DocumentList;

        return dto;
    }
}
