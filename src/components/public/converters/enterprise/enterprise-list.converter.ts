import { Injectable } from '@nestjs/common';
import { EnterpriseConverter } from './enterprise.converter';
import { Enterprise } from '@/components/enterprise/entities/enterprise.entity';
import { EnterpriseList } from '@/components/enterprise/dto/enterprise-list.dto';

@Injectable()
export class EnterpriseListConverter {
    constructor(private enterpriseConverter: EnterpriseConverter) {}
    toDto(page: number, limit: number, total: number, entity: Enterprise[]) {
        const dto = {
            limit: limit,
            page: page,
            total: total,
            enterprises: entity.map((data) =>
                this.enterpriseConverter.toDto(data),
            ),
        } as EnterpriseList;

        return dto;
    }
}
