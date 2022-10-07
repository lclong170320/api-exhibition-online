import { Information as InformationDto } from '@/components/user/dto/information.dto';
import { Information } from '@/components/user/entities/information.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InformationConverter {
    toEntity(dto: InformationDto) {
        const entity = new Information();
        entity.name = dto.name;
        entity.address = dto.address;
        entity.email = dto.email;
        return entity;
    }

    toDto(entity: Information) {
        const dto = {
            name: entity.name,
            user_id: entity.user.id,
            address: entity.address,
            email: entity.email,
            media_id: entity.mediaId ?? undefined,
        } as InformationDto;
        return dto;
    }
}
