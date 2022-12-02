import { BoothProject as BoothProjectDto } from '@/components/exhibition/dto/booth-project.dto';
import { BoothProject } from '@/components/exhibition/entities/booth-project.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoothProjectConverter {
    toDto(entity: BoothProject) {
        const dto = {
            id: entity.id,
            view: undefined,
            image_id: entity.project.imageId,
            title: entity.project.title,
            description: entity.project.description,
            booth_template_position: entity.boothTemplatePosition ?? undefined,
        } as BoothProjectDto;

        return dto;
    }
}
