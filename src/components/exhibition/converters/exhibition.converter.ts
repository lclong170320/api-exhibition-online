import { Exhibition as ExhibitionDto } from '@/components/exhibition/dto/exhibition.dto';
import { Exhibition } from '@/components/exhibition/entities/exhibition.entity';
import { Injectable } from '@nestjs/common';
import { BoothOrganizationConverter } from './booth-organization.converter';
import { BoothConverter } from './booth.converter';
import CategoryConverter from './category.converter';
import { ConferenceConverter } from './conference.converter';
import { SpaceConverter } from './space.converter';

@Injectable()
export class ExhibitionConverter {
    constructor(
        private categoryConverter: CategoryConverter,
        private spaceConverter: SpaceConverter,
        private boothConverter: BoothConverter,
        private boothOrganizationConverter: BoothOrganizationConverter,
        private conferenceConverter: ConferenceConverter,
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
    toDto(entity: Exhibition) {
        const dto = {
            id: entity.id,
            name: entity.name ?? undefined,
            exhibition_code: entity.exhibitionCode ?? undefined,
            booth_number: entity.boothNumber ?? undefined,
            date_exhibition_start: entity.dateExhibitionStart
                ? entity.dateExhibitionStart.toISOString()
                : undefined,
            date_exhibition_end: entity.dateExhibitionEnd
                ? entity.dateExhibitionEnd.toISOString()
                : undefined,
            introduction: entity.introduction ?? undefined,
            agenda: entity.agenda ?? undefined,
            status: entity.status ?? undefined,
            category: entity.category
                ? this.categoryConverter.toDto(entity.category)
                : undefined,
            space: entity.space
                ? this.spaceConverter.toDto(entity.space)
                : undefined,
            conference: entity.conference
                ? this.conferenceConverter.toDto(entity.conference)
                : undefined,
            booth_organization: entity.boothOrganization
                ? this.boothOrganizationConverter.toDto(
                      entity.boothOrganization,
                  )
                : undefined,
            booths: entity.booths
                ? entity.booths.map((booth) => this.boothConverter.toDto(booth))
                : undefined,
        } as ExhibitionDto;

        return dto;
    }
}
