import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ExhibitionService } from '@/components/exhibition/services/exhibition.service';
import { Exhibition as ExhibitionDto } from '@/components/exhibition/dto/exhibition.dto';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Booth as BoothDto } from '@/components/exhibition/dto/booth.dto';

@Controller('exhibitions')
export class ExhibitionController {
    constructor(private readonly exhibitionService: ExhibitionService) {}

    @Get(':id')
    getExhibitionById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.exhibitionService.findExhibitionById(id, query.populate);
    }

    @Get()
    getExhibitions(@Paginate() query: PaginateQuery) {
        return this.exhibitionService.findExhibitions(query);
    }

    @Post()
    createExhibition(@Body() exhibition: ExhibitionDto) {
        return this.exhibitionService.createExhibition(exhibition);
    }

    @Post(':exhibitionId/booths')
    createBooth(
        @Param('exhibitionId') exhibitionId: string,
        @Body() boothDto: BoothDto,
    ) {
        return this.exhibitionService.createBooth(
            parseInt(exhibitionId),
            boothDto,
        );
    }
    @Get(':exhibitionId/booths/:boothId')
    getBoothById(
        @Param('exhibitionId') exhibitionId: string,
        @Param('boothId') boothId: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.exhibitionService.getBoothById(
            exhibitionId,
            boothId,
            query.populate,
        );
    }

    @Put(':exhibition_id/booths/:booth_id')
    updateBooth(
        @Param('exhibition_id') exhibitionId: string,
        @Param('booth_id') boothId: string,
        @Body() boothDto: BoothDto,
    ) {
        return this.exhibitionService.updateBooth(
            exhibitionId,
            boothId,
            boothDto,
        );
    }
}
