import { Exhibition as ExhibitionDto } from '@/components/exhibition/dto/exhibition.dto';
import { Exhibition } from '@/components/exhibition/entities/exhibition.entity';
import { Injectable } from '@nestjs/common';
import { BoothOrganizationConverter } from './booth-organization.converter';
import { BoothConverter } from './booth.converter';
import CategoryConverter from './category.converter';
import { SpaceConverter } from './space.converter';

@Injectable()
export class ExhibitionConverter {
    constructor(
        private categoryConverter: CategoryConverter,
        private spaceConverter: SpaceConverter,
        private boothConverter: BoothConverter,
        private boothOrganizationConverter: BoothOrganizationConverter,
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
        return entity;
    }
    async toDto(entity: Exhibition) {
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
            category: entity.category
                ? this.categoryConverter.toDto(entity.category)
                : undefined,
            space: entity.space
                ? this.spaceConverter.toDto(entity.space)
                : undefined,
            booth_organization: entity.boothOrganization
                ? this.boothOrganizationConverter.toDto(
                      entity.boothOrganization,
                  )
                : undefined,
            booths: entity.booths
                ? await Promise.all(
                      entity.booths.map(
                          async (booth) =>
                              await this.boothConverter.toDto(booth),
                      ),
                  )
                : undefined,
        } as ExhibitionDto;

        return dto;
    }
}
