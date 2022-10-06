import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Enterprise } from './entities/enterprise.entity';
import { DbConnection } from '@/database/config/db';

@Injectable()
export class EnterpriseRepository extends Repository<Enterprise> {
    constructor(
        @InjectDataSource(DbConnection.enterpriseCon)
        private readonly dataSource: DataSource,
    ) {
        super(Enterprise, dataSource.createEntityManager());
    }

    async getEnterprises(
        keyword: string,
        limit: number,
        offset: number,
        sort: Map<string, string>,
    ): Promise<[Enterprise[], number]> {
        const builder = this.createQueryBuilder();
        // apply searching keyword
        builder.where(`abbreviation like :abbreviation`, {
            abbreviation: `%${keyword}%`,
        });

        // apply limit and offset
        builder.take(limit);
        builder.skip(offset);

        // apply sort params
        for (const [key, value] of sort) {
            const sortValue = value === 'DESC' ? value : 'ASC';
            builder.orderBy(key, sortValue);
        }

        // execute query
        return await builder.getManyAndCount();
    }
}

export const ALLOWED_SORT_COLUMNS = ['abbreviation', 'created_at'];
