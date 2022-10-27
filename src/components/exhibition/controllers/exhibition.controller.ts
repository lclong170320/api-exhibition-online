import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ExhibitionService } from '@/components/exhibition/services/exhibition.service';
import { Exhibition as ExhibitionDto } from '@/components/exhibition/dto/exhibition.dto';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';

@Controller('exhibitions')
export class ExhibitionController {
    constructor(private readonly exhibitionService: ExhibitionService) {}

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.exhibitionService.findById(id);
    }

    @Get()
    getExhibitions(@Paginate() query: PaginateQuery) {
        return this.exhibitionService.findExhibitions(query);
    }

    @Post()
    createExhibition(@Body() exhibition: ExhibitionDto) {
        return this.exhibitionService.createExhibition(exhibition);
    }
}
