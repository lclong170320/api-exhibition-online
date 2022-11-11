// import { SpaceData as SpaceDataDto } from '@/components/exhibition/dto/space-data.dto';
// import { SpaceData } from '@/components/exhibition/entities/space-data.entity';
// import { Injectable } from '@nestjs/common';
// import { PositionSpaceConverter } from './position-space.converter';

// @Injectable()
// export class SpaceDataConverter {
//     constructor(
//         private readonly positionSpaceConverter: PositionSpaceConverter,
//     ) {}
//     toEntity(dto: SpaceDataDto) {
//         const entity = new SpaceData();
//         entity.title = dto.title;
//         entity.description = dto.description;
//         return entity;
//     }

//     toDto(entity: SpaceData) {
//         const dto = {
//             id: entity.id,
//             position_space: entity.positionSpace
//                 ? this.positionSpaceConverter.toDto(entity.positionSpace)
//                 : undefined,
//             media_id: entity.mediaId ?? undefined,
//             title: entity.title ?? undefined,
//             description: entity.description ?? undefined,
//         } as SpaceDataDto;

//         return dto;
//     }
// }
