import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ExhibitionService } from '../services/exhibition.service';
import { Exhibition as exhibitionDto } from '../dto/exhibition.dto';

@Controller('exhibitions')
export class ExhibitionController {
    constructor(private readonly exhibitionService: ExhibitionService) {}

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.exhibitionService.findById(id);
    }
    @Post()
    createExhibition(@Body() exhibition: exhibitionDto) {
        return this.exhibitionService.createExhibition(exhibition);
    }
}
