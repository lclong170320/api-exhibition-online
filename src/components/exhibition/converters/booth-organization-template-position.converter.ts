import { BoothOrganizationTemplatePosition as BoothOrganizationTemplatePositionDto } from '@/components/exhibition/dto/booth-organization-template-position.dto';
import { BoothOrganizationTemplatePosition } from '@/components/exhibition/entities/booth-organization-template-position.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoothOrganizationTemplatePositionConverter {
    toEntity(dto: BoothOrganizationTemplatePositionDto) {
        const entity = new BoothOrganizationTemplatePosition();
        entity.type = dto.type ?? undefined;
        entity.position = dto.position ?? undefined;
        return entity;
    }

    toDto(entity: BoothOrganizationTemplatePosition) {
        const dto = {
            id: entity.id,
            position: entity.position ?? undefined,
            type: entity.type ?? undefined,
        } as BoothOrganizationTemplatePositionDto;

        return dto;
    }
}
