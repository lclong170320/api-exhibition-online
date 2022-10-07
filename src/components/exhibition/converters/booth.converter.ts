import { Booth as BoothDto } from '@/components/exhibition/dto/booth.dto';
import { Booth } from '@/components/exhibition/entities/booth.entity';
import { Injectable } from '@nestjs/common';
import { BoothDataConverter } from './booth-data.converter';

@Injectable()
export class BoothConverter {
    constructor(private boothDataConverter: BoothDataConverter) {}

    toEntity(dto: BoothDto) {
        const entity = new Booth();
        entity.name = dto.name;
        entity.boothDatas = dto.boothDatas.map((data) =>
            this.boothDataConverter.toEntity(data),
        );
        return entity;
    }

    toDto(entity: Booth) {
        const dto = {
            id: entity.id,
            name: entity.name,
            booth_template_id: entity.boothTemplate?.id,
            boothDatas: entity.boothDatas.map((data) =>
                this.boothDataConverter.toDto(data),
            ),
            exhibition_id: entity.exhibition?.id,
            user_id: entity.userId,
        } as BoothDto;

        return dto;
    }
}
