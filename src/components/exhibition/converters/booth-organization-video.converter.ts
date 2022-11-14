import { BoothOrganizationVideo as BoothOrganizationVideoDto } from '@/components/exhibition/dto/booth-organization-video.dto';
import { BoothOrganizationVideo } from '../entities/booth-organization-video.entity';
import { Injectable } from '@nestjs/common';
import { BoothOrganizationTemplatePositionConverter } from './booth-organization-template-position.converter';

@Injectable()
export class BoothOrganizationVideoConverter {
    constructor(
        private readonly boothOrganizationTemplatePositionConverter: BoothOrganizationTemplatePositionConverter,
    ) {}
    toDto(entity: BoothOrganizationVideo) {
        const dto = {
            id: entity.id,
            video_id: entity.video?.videoId ?? undefined,
            booth_organization_template_position:
                entity.boothOrganizationTemplatePosition
                    ? this.boothOrganizationTemplatePositionConverter.toDto(
                          entity.boothOrganizationTemplatePosition,
                      )
                    : undefined,
        } as BoothOrganizationVideoDto;

        return dto;
    }
}
