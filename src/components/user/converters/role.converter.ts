import { Role as RoleDto } from '@/components/user/dto/role.dto';
import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleConverter {
    toEntity(dto: RoleDto) {
        const entity = new Role();
        entity.name = dto.name;
        return entity;
    }

    toDto(entity: Role) {
        const dto = {
            id: entity.id,
            name: entity.name,
        } as RoleDto;

        return dto;
    }
}
