import { Injectable } from '@nestjs/common';
import { SpaceTemplateList } from '../dto/space-template-list.dto';
import { SpaceTemplate } from '../entities/space-template.entity';
import { SpaceTemplateConverter } from './space-template.converter';

@Injectable()
export class SpaceTemplateListConverter {
    constructor(private spaceTemplateConverter: SpaceTemplateConverter) {}
    toDto(page: number, limit: number, total: number, entity: SpaceTemplate[]) {
        const dto = {
            page: page,
            limit: limit,
            total: total,
            spaceTemplates: entity.map((data) =>
                this.spaceTemplateConverter.toDto(data),
            ),
        } as SpaceTemplateList;

        return dto;
    }
}
