import { Exhibition as ExhibitionDto } from '@/components/exhibition/dto/exhibition.dto';
import { Exhibition } from '@/components/exhibition/entities/exhibition.entity';

export class ExhibitionConverter {
    toEntity(dto: ExhibitionDto) {
        const entity = new Exhibition();
        entity.name = dto.name;
        entity.description = dto.description;
        entity.boothNumber = dto.booth_number;
        entity.exhibitionCode = dto.exhibition_code.toUpperCase();
        entity.dateExhibitionStart = new Date(dto.date_exhibition_start);
        entity.dateExhibitionEnd = new Date(dto.date_exhibition_end);
        entity.dateInputDataStart = new Date(dto.date_input_data_start);
        entity.dateInputDataEnd = new Date(dto.date_input_data_end);
        return entity;
    }
    toDto(entity: Exhibition) {
        const dto = {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            booth_number: entity.boothNumber,
            category_id: entity.category.id,
            exhibition_code: entity.exhibitionCode,
            date_exhibition_start: entity.dateExhibitionStart.toISOString(),
            date_exhibition_end: entity.dateExhibitionEnd.toISOString(),
            date_input_data_start: entity.dateInputDataStart.toISOString(),
            date_input_data_end: entity.dateInputDataEnd.toISOString(),
            booth_template_ids: entity.boothTemplates.map((data) => data.id),
            booth_ids: entity.booths.map((data) => data.id),
            space_id: entity.space.id,
            organization_booth_id: entity.booths.filter(
                (data) => data.isOrganization,
            )[0].id,
        } as ExhibitionDto;

        return dto;
    }
}
