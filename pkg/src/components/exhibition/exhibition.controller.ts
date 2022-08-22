import { Controller, Get } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';

@Controller('exhibition')
export class ExhibitionController {
    constructor(private readonly exhibitionService: ExhibitionService) {}

    @Get()
    findAll() {
        return this.exhibitionService.findAll();
    }
}
