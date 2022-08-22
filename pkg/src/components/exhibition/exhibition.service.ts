import { DbConnection } from '@/database/config/db';
import { Exhibition } from './entities/exhibition.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExhibitionService {
    constructor(
        @InjectRepository(Exhibition, DbConnection.exhibitionCon)
        private readonly exhibitionRepository: Repository<Exhibition>,
    ) {}

    findAll(): Promise<Exhibition[]> {
        return this.exhibitionRepository.find();
    }
}
