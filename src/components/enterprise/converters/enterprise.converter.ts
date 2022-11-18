import { Injectable } from '@nestjs/common';
import { Enterprise } from '@/components/enterprise/entities/enterprise.entity';
import { Enterprise as EnterpriseDto } from '@/components/enterprise/dto/enterprise.dto';

@Injectable()
export class EnterpriseConverter {
    toEntity(dto: EnterpriseDto) {
        const entity = new Enterprise();
        entity.name = dto.name;
        entity.imageId = dto.image_id;
        entity.phone = dto.phone;
        entity.email = dto.email;
        entity.address = dto.address;
        entity.description = dto.description;
        entity.typeOfBusiness = dto.type_of_business;
        entity.linkWebsite = dto.link_website;
        entity.linkProfile = dto.link_profile;
        return entity;
    }

    toDto(entity: Enterprise) {
        const dto = {
            id: entity.id,
            name: entity.name,
            image_id: entity.imageId,
            phone: entity.phone,
            email: entity.email,
            address: entity.address,
            description: entity.description,
            link_website: entity.linkWebsite ?? undefined,
            link_profile: entity.linkProfile ?? undefined,
            type_of_business: entity.typeOfBusiness,
            created_date: entity.createdDate.toISOString(),
        } as EnterpriseDto;

        return dto;
    }
}
