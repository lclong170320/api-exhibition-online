import { DbConnection } from '@/database/config/db';
import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpaceTemplate } from '@/components/exhibition/entities/space-template.entity';
import { SpaceTemplateConverter } from '@/components/exhibition/converters/space-template.converter';

@Injectable()
export class SpaceTemplateService {
    constructor(
        @InjectRepository(SpaceTemplate, DbConnection.exhibitionCon)
        private readonly spaceTemplateRepository: Repository<SpaceTemplate>,
        private spaceTemplateConverter: SpaceTemplateConverter,
    ) {}

    async findSpaceTemplateById(id: string, populate: string[]) {
        const firstSpaceTemplate = await this.spaceTemplateRepository.findOne({
            where: {
                id: parseInt(id),
            },
            relations: populate,
        });

        if (!firstSpaceTemplate) {
            throw new NotFoundException(`The 'space_id' ${id} is not found`);
        }

        return this.spaceTemplateConverter.toDto(firstSpaceTemplate);
    }
}
