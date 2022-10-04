import { Exhibition as ExhibitionDto } from '@/components/exhibition/dto/exhibition.dto';
import { Exhibition } from '@/components/exhibition/entities/exhibition.entity';

export class ExhibitionConverter {
    toEntity(dto: ExhibitionDto) {
        const entity = new Exhibition();
        entity.name = dto.name;
        entity.description = dto.description;
        entity.boothNumber = dto.booth_number;
        entity.exhibitionCode = dto.exhibition_code.toUpperCase();
        entity.dateExhibitionStart = dto.date_exhibition_start;
        entity.dateExhibitionEnd = dto.date_exhibition_end;
        entity.dateInputDataStart = dto.date_input_data_start;
        entity.dateInputDataEnd = dto.date_input_data_end;
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
            date_exhibition_start: entity.dateExhibitionStart,
            date_exhibition_end: entity.dateExhibitionEnd,
            date_input_data_start: entity.dateInputDataStart,
            date_input_data_end: entity.dateInputDataEnd,
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
