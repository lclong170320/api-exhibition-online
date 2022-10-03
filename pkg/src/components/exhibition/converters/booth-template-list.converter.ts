import { BoothTemplateList as BoothTemplateListDto } from '@/components/exhibition/dto/booth-template-list.dto';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { Injectable } from '@nestjs/common';
import { BoothTemplateConverter } from './booth-template.converter';

@Injectable()
export class BoothTemplateListConverter {
    constructor(private boothTemplateConverter: BoothTemplateConverter) {}
    toDto(
        entity: BoothTemplate[],
        limit: number,
        offset: number,
        total: number,
    ) {
        const dto = {
            limit: limit,
            offset: offset,
            total: total,
            booth_templates: entity.map((data) =>
                this.boothTemplateConverter.toDto(data),
            ),
        } as BoothTemplateListDto;

        return dto;
    }
}
