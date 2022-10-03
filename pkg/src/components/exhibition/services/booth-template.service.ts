import { DbConnection } from '@/database/config/db';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { BoothTemplateListConverter } from '../converters/booth-template-list.converter';

@Injectable()
export class BoothTemplateService {
    private readonly offsetDefault = 0;
    private readonly limitDefault = 10;
    constructor(
        @InjectRepository(BoothTemplate, DbConnection.exhibitionCon)
        private readonly boothTemplateRepository: Repository<BoothTemplate>,
        private boothTemplateListConverter: BoothTemplateListConverter,
    ) {}

    async findBoothTemplates(offset: string, limit: string) {
        const offsetQuery = parseInt(offset)
            ? parseInt(offset)
            : this.offsetDefault;
        const limitQuery = parseInt(limit)
            ? parseInt(limit)
            : this.limitDefault;

        const [boothTemplateEntity, count] =
            await this.boothTemplateRepository.findAndCount({
                order: {
                    createdAt: 'DESC',
                },
                skip: offsetQuery,
                take: limitQuery,
            });

        return this.boothTemplateListConverter.toDto(
            boothTemplateEntity,
            limitQuery,
            offsetQuery,
            count,
        );
    }
}
