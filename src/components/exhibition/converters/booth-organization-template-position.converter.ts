import { BoothOrganizationTemplatePosition as BoothOrganizationTemplatePositionDto } from '@/components/exhibition/dto/booth-organization-template-position.dto';
import { BoothOrganizationTemplatePosition } from '@/components/exhibition/entities/booth-organization-template-position.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoothOrganizationTemplatePositionConverter {
    toDto(entity: BoothOrganizationTemplatePosition) {
        const dto = {
            id: entity.id,
            position: entity.position ?? undefined,
            type: entity.type ?? undefined,
        } as BoothOrganizationTemplatePositionDto;

        return dto;
    }
}
