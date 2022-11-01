import { Injectable } from '@nestjs/common';
import { Enterprise } from '@/components/enterprise/entities/enterprise.entity';
import { Enterprise as EnterpriseDto } from '@/components/enterprise/dto/enterprise.dto';
import { DocumentConverter } from './enterprise-document.converter';

@Injectable()
export class EnterpriseConverter {
    constructor(private readonly documentConverter: DocumentConverter) {}
    toEntity(dto: EnterpriseDto) {
        const entity = new Enterprise();
        entity.internationalName = dto.international_name;
        entity.abbreviation = dto.abbreviation;
        entity.taxCode = dto.tax_code;
        entity.address = dto.address;
        entity.ceo = dto.ceo;
        entity.phone = dto.phone;
        entity.status = dto.status;
        entity.typeOfBusiness = dto.type_of_business;
        entity.managerBy = dto.manager_by;
        entity.viewCompanyOnline = dto.view_company_online;
        entity.activeDate = new Date(Date.parse(dto.active_date));
        return entity;
    }

    toDto(entity: Enterprise) {
        const dto = {
            id: entity.id,
            international_name: entity.internationalName,
            abbreviation: entity.abbreviation,
            tax_code: entity.taxCode,
            address: entity.address,
            ceo: entity.ceo,
            phone: entity.phone,
            created_by: entity.createdBy,
            created_date: entity.createdDate.toISOString(),
            status: entity.status,
            type_of_business: entity.typeOfBusiness,
            view_company_online: entity.viewCompanyOnline,
            manager_by: entity.managerBy,
            active_date: entity.activeDate.toISOString(),
            documents: entity.documents
                ? entity.documents.map((data) =>
                      this.documentConverter.toDto(data),
                  )
                : undefined,
        } as EnterpriseDto;

        return dto;
    }
}
