import { Injectable } from '@nestjs/common';
import { EnterpriseList } from '../dto/enterprise-list.dto';
import { Enterprise } from '../entities/enterprise.entity';
import { EnterpriseConverter } from './enterprise.converter';

@Injectable()
export class EnterpriseListConverter {
    constructor(private enterpriseConverter: EnterpriseConverter) {}
    toDto(entity: Enterprise[], limit: number, offset: number, total: number) {
        const dto = {
            limit: limit,
            offset: offset,
            total: total,
            enterprises: entity.map((data) =>
                this.enterpriseConverter.toDto(data),
            ),
        } as EnterpriseList;

        return dto;
    }
}