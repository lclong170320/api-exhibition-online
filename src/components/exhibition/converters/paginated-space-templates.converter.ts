import { PaginatedSpaceTemplates as PaginatedSpaceTemplatesDto } from '@/components/exhibition/dto/paginated-space-templates.dto';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';
import { Injectable } from '@nestjs/common';
import { SpaceTemplateConverter } from './space-template.converter';

@Injectable()
export class PaginatedSpaceTemplatesConverter {
    constructor(private spaceTemplateConverter: SpaceTemplateConverter) {}
    toDto(page: number, limit: number, total: number, entity: SpaceTemplate[]) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            space_templates: entity.map((data) =>
                this.spaceTemplateConverter.toDto(data),
            ),
        } as PaginatedSpaceTemplatesDto;

        return dto;
    }
}
