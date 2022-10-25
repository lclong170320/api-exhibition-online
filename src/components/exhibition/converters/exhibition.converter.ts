import { Exhibition as ExhibitionDto } from '@/components/exhibition/dto/exhibition.dto';
import { Exhibition } from '@/components/exhibition/entities/exhibition.entity';

export class ExhibitionConverter {
    toEntity(dto: ExhibitionDto) {
        const entity = new Exhibition();
        entity.name = dto.name;
        entity.boothNumber = dto.booth_number;
        entity.exhibitionCode = dto.exhibition_code.toUpperCase();
        entity.dateExhibitionStart = new Date(dto.date_exhibition_start);
        entity.dateExhibitionEnd = new Date(dto.date_exhibition_end);
        entity.introduction = dto.introduction;
        entity.agenda = dto.agenda;
        return entity;
    }
    toDto(entity: Exhibition) {
        const dto = {
            id: entity.id,
            name: entity.name,
            booth_number: entity.boothNumber,
            category_id: entity.category.id,
            exhibition_code: entity.exhibitionCode,
            date_exhibition_start: entity.dateExhibitionStart.toISOString(),
            date_exhibition_end: entity.dateExhibitionEnd.toISOString(),
            booth_template_ids: entity.boothTemplates.map((data) => data.id),
            space_template_id: entity.spaceTemplate.id,
            introduction: entity.introduction,
            agenda: entity.agenda,
            space_id: entity.space.id,
            organization_booth_id: entity.boothOrganization.id,
            organization_booth_template_id:
                entity.boothOrganization.boothTemplate.id,
        } as ExhibitionDto;

        return dto;
    }
}
