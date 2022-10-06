import { DbConnection } from '@/database/config/db';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoothTemplate } from '@/components/exhibition/entities/booth-template.entity';
import { BoothTemplateListConverter } from '@/components/exhibition/converters/booth-template-list.converter';
import { BoothTemplateConverter } from '@/components/exhibition/converters/booth-template.converter';

@Injectable()
export class BoothTemplateService {
    private readonly offsetDefault = 0;
    private readonly limitDefault = 10;
    constructor(
        @InjectRepository(BoothTemplate, DbConnection.exhibitionCon)
        private readonly boothTemplateRepository: Repository<BoothTemplate>,
        private boothTemplateListConverter: BoothTemplateListConverter,
        private boothTemplateConverter: BoothTemplateConverter,
    ) {}

    async findBoothTemplateById(id: string) {
        const firstBoothTemplate = await this.boothTemplateRepository.findOneBy(
            {
                id: parseInt(id),
            },
        );

        return this.boothTemplateConverter.toDto(firstBoothTemplate);
    }

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
