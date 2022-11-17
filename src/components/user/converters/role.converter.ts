import {
    Role as RoleDto,
    RoleName as RoleNameDto,
} from '@/components/user/dto/role.dto';
import { Injectable } from '@nestjs/common';
import { Role, RoleName as RoleName } from '../entities/role.entity';

@Injectable()
export class RoleConverter {
    toEntity(dto: RoleDto) {
        const entity = new Role();
        entity.name =
            dto.name === RoleNameDto.ADMIN ? RoleName.ADMIN : RoleName.USER;
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
