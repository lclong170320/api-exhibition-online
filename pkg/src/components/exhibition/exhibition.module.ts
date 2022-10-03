import { DbConnection } from '@/database/config/db';
import { ExhibitionService } from './exhibition.service';
import { ExhibitionController } from './exhibition.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibition } from './entities/exhibition.entity';
import { ExhibitionConverter } from './converters/exhibition.converter';

@Module({
    controllers: [ExhibitionController],
    providers: [ExhibitionService, ExhibitionConverter],
    imports: [
        TypeOrmModule.forFeature([Exhibition], DbConnection.exhibitionCon),
    ],
    exports: [TypeOrmModule],
})
export class ExhibitionModule {}
