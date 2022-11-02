import { Project as ProjectDto } from '@/components/exhibition/dto/project.dto';
import { Project } from '@/components/exhibition/entities/project.entity';
import { Injectable } from '@nestjs/common';
import { PositionBoothConverter } from './position-booth.converter';

@Injectable()
export class ProjectConverter {
    constructor(
        private readonly positionBoothConverter: PositionBoothConverter,
    ) {}
    toEntity(dto: ProjectDto) {
        const entity = new Project();
        entity.title = dto.title;
        entity.description = dto.description;
        return entity;
    }

    toDto(entity: Project) {
        const dto = {
            id: entity.id,
            position_booth_id: entity.positionBooth.id,
            media_id: entity.mediaId ?? undefined,
            title: entity.title ?? undefined,
            description: entity.description ?? undefined,
        } as ProjectDto;

        return dto;
    }
}
