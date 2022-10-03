import { DbConnection } from '@/database/config/db';
import { Exhibition } from './entities/exhibition.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExhibitionConverter } from './converters/exhibition.converter';
import { Exhibition as ExhibitionDto } from './dto/exhibition.dto';

@Injectable()
export class ExhibitionService {
    constructor(
        @InjectRepository(Exhibition, DbConnection.exhibitionCon)
        private readonly exhibitionRepository: Repository<Exhibition>,
        private exhibitionConverter: ExhibitionConverter,
    ) {}

    async findById(id: string): Promise<ExhibitionDto> {
        {
            const exhibitionId = parseInt(id);
            const entity = await this.exhibitionRepository.findOne({
                where: {
                    id: exhibitionId,
                },
            });
            return this.exhibitionConverter.toDto(entity);
        }
    }
}
