import { DbConnection } from '@/database/config/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { paginate } from '@/utils/pagination';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { DataSource } from 'typeorm';
import { PaginatedEnterprisesConverter } from './converters/paginated-enterprises.converter';
import { EnterpriseConverter } from './converters/enterprise.converter';
import { Enterprise as EnterpriseDto } from './dto/enterprise.dto';
import { toDataURL } from 'qrcode';
import { Enterprise } from './entities/enterprise.entity';

@Injectable()
export class EnterpriseService {
    constructor(
        @InjectDataSource(DbConnection.enterpriseCon)
        private readonly dataSource: DataSource,
        private readonly enterpriseConverter: EnterpriseConverter,
        private readonly paginatedEnterprisesConverter: PaginatedEnterprisesConverter,
    ) {}

    async readEnterprises(query: PaginateQuery) {
        const enterpriseRepository =
            this.dataSource.manager.getRepository(Enterprise);
        const sortableColumns = ['createdDate'];
        const searchableColumns = ['name'];
        const defaultSortBy = [['createdAt', 'DESC']];
        const [enterprises, total] = await paginate(
            query,
            enterpriseRepository,
            {
                searchableColumns,
                sortableColumns,
                defaultSortBy,
                withDeleted: query.withDeleted,
            },
        );
        return this.paginatedEnterprisesConverter.toDto(
            query.page,
            query.limit,
            total,
            enterprises,
        );
    }

    async readEnterpriseById(id: string, query: PaginateQuery) {
        const enterpriseEntity = await this.findOneEnterprise(id, query);
        return this.enterpriseConverter.toDto(enterpriseEntity);
    }

    async createEnterprise(
        enterpriseDto: EnterpriseDto,
    ): Promise<EnterpriseDto> {
        const enterpriseRepository =
            this.dataSource.manager.getRepository(Enterprise);
        const newEnterpriseEntity =
            this.enterpriseConverter.toEntity(enterpriseDto);
        newEnterpriseEntity.createdDate = new Date();

        const createdEnterprise = await enterpriseRepository.save(
            newEnterpriseEntity,
        );

        return this.enterpriseConverter.toDto(createdEnterprise);
    }

    async generateQR(text: string): Promise<string> {
        return await toDataURL(text);
    }

    async createQrCode(id: string): Promise<object> {
        const url = `${process.env.CLIENT_HOST}enterprises/${id}/profiles`;
        const qrcode = await this.generateQR(url);
        return { qrcode: qrcode };
    }

    private async findEnterpriseById(id: string) {
        const enterpriseRepository =
            this.dataSource.manager.getRepository(Enterprise);
        const enterpriseEntity = await enterpriseRepository.findOneBy({
            id: parseInt(id),
        });
        if (!enterpriseEntity) {
            throw new NotFoundException('The id enterprise not exist: ' + id);
        }
        return enterpriseEntity;
    }

    private async findOneEnterprise(id: string, query: PaginateQuery) {
        const enterpriseRepository =
            this.dataSource.manager.getRepository(Enterprise);
        const enterpriseEntity = await enterpriseRepository.findOne({
            where: { id: parseInt(id) },
            withDeleted: query.withDeleted,
        });
        if (!enterpriseEntity) {
            throw new NotFoundException('The id enterprise not exist: ' + id);
        }
        return enterpriseEntity;
    }

    async updateEnterprise(id: string, newEnterpriseDto: EnterpriseDto) {
        const enterpriseRepository =
            this.dataSource.manager.getRepository(Enterprise);
        const enterpriseEntity = await this.findEnterpriseById(id);
        const newEnterpriseEntity =
            this.enterpriseConverter.toEntity(newEnterpriseDto);
        const newEnterprise = await enterpriseRepository.save({
            ...enterpriseEntity,
            ...newEnterpriseEntity,
        });
        return this.enterpriseConverter.toDto(newEnterprise);
    }

    async deleteEnterprise(id: string) {
        const enterpriseRepository =
            this.dataSource.manager.getRepository(Enterprise);
        const deleteResponse = await enterpriseRepository.softDelete(
            parseInt(id),
        );
        if (!deleteResponse.affected) {
            throw new NotFoundException('The id not exist: ');
        }
    }
}
