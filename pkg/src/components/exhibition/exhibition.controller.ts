import { Controller, Get } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';

@Controller('exhibition')
export class ExhibitionController {
    constructor(private readonly exhibitionService: ExhibitionService) {}

    @Get()
    findAll() {
        return this.exhibitionService.findAll();
    }
}
