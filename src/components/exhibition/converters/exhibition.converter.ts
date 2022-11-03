import { Exhibition as ExhibitionDto } from '@/components/exhibition/dto/exhibition.dto';
import { Exhibition } from '@/components/exhibition/entities/exhibition.entity';
import { Injectable } from '@nestjs/common';
import { BoothOrganizationConverter } from './booth-organization.converter';
import { BoothTemplateConverter } from './booth-template.converter';
import { BoothConverter } from './booth.converter';
import CategoryConverter from './category.converter';
import { SpaceTemplateConverter } from './space-template.converter';
import { SpaceConverter } from './space.converter';

@Injectable()
export class ExhibitionConverter {
    constructor(
        private categoryConverter: CategoryConverter,
        private boothTemplateConverter: BoothTemplateConverter,
        private spaceTemplateConverter: SpaceTemplateConverter,
        private spaceConverter: SpaceConverter,
        private boothOrganizationConverter: BoothOrganizationConverter,
        private boothConverter: BoothConverter,
    ) {}
    toEntity(dto: ExhibitionDto) {
        const entity = new Exhibition();
        entity.name = dto.name;
        entity.boothNumber = dto.booth_number;
        entity.exhibitionCode = dto.exhibition_code.toUpperCase();
        entity.dateExhibitionStart = new Date(dto.date_exhibition_start);
        entity.dateExhibitionEnd = new Date(dto.date_exhibition_end);
        entity.introduction = dto.introduction;
        entity.agenda = dto.agenda;
        entity.status = dto.status;
        return entity;
    }
    toDto(entity: Exhibition) {
        const dto = {
            id: entity.id,
            name: entity.name,
            exhibition_code: entity.exhibitionCode,
            booth_number: entity.boothNumber,
            date_exhibition_start: entity.dateExhibitionStart.toISOString(),
            date_exhibition_end: entity.dateExhibitionEnd.toISOString(),
            introduction: entity.introduction,
            agenda: entity.agenda,
            status: entity.status,
            booths: entity.booths
                ? entity.booths.map((booth) => this.boothConverter.toDto(booth))
                : undefined,
            category: entity.category
                ? this.categoryConverter.toDto(entity.category)
                : undefined,
            space: entity.space
                ? this.spaceConverter.toDto(entity.space)
                : undefined,
            space_template: entity.spaceTemplate
                ? this.spaceTemplateConverter.toDto(entity.spaceTemplate)
                : undefined,
            organization_booth: entity.boothOrganization
                ? this.boothOrganizationConverter.toDto(
                      entity.boothOrganization,
                  )
                : undefined,
            booth_templates: entity.boothTemplates
                ? entity.boothTemplates.map((data) =>
                      this.boothTemplateConverter.toDto(data),
                  )
                : undefined,
            organization_booth_template_id: entity.boothOrganization
                ? this.boothOrganizationConverter.toDto(
                      entity.boothOrganization,
                  ).booth_template_id
                : undefined,
        } as ExhibitionDto;

        return dto;
    }
}
