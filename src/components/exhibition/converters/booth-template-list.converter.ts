import { BoothTemplateList as BoothTemplateListDto } from '@/components/exhibition/dto/booth-template-list.dto';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { Injectable } from '@nestjs/common';
import { BoothTemplateConverter } from './booth-template.converter';

@Injectable()
export class BoothTemplateListConverter {
    constructor(private boothTemplateConverter: BoothTemplateConverter) {}
    toDto(page: number, limit: number, total: number, entity: BoothTemplate[]) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            booth_templates: entity.map((data) =>
                this.boothTemplateConverter.toDto(data),
            ),
        } as BoothTemplateListDto;

        return dto;
    }
}
