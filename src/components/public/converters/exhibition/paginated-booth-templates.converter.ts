import { PaginatedBoothTemplates as PaginatedBoothTemplatesDto } from '@/components/exhibition/dto/paginated-booth-templates.dto';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { Injectable } from '@nestjs/common';
import { BoothTemplateConverter } from './booth-template.converter';

@Injectable()
export class PaginatedBoothTemplatesConverter {
    constructor(private boothTemplateConverter: BoothTemplateConverter) {}
    toDto(page: number, limit: number, total: number, entity: BoothTemplate[]) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            booth_templates: entity.map((data) =>
                this.boothTemplateConverter.toDto(data),
            ),
        } as PaginatedBoothTemplatesDto;

        return dto;
    }
}
