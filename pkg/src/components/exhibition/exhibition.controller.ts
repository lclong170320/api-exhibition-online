import { Controller, Get, Param } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';

@Controller('exhibitions')
export class ExhibitionController {
    constructor(private readonly exhibitionService: ExhibitionService) {}

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.exhibitionService.findById(id);
    }
}
