import { Injectable } from '@nestjs/common';
import { Profile } from '@/components/enterprise/entities/profile.entity';
import { EnterpriseProfile as ProfileDto } from '@/components/enterprise/dto/enterprise-profile.dto';

@Injectable()
export class ProfileConverter {
    toEntity(dto: ProfileDto) {
        const entity = {
            documentIds: dto.document_ids,
        } as Profile;
        return entity;
    }
}
