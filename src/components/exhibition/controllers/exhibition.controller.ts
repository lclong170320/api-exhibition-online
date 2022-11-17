import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ExhibitionService } from '@/components/exhibition/services/exhibition.service';
import { Exhibition as ExhibitionDto } from '@/components/exhibition/dto/exhibition.dto';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Booth as BoothDto } from '@/components/exhibition/dto/booth.dto';
import { Role } from '@/components/exhibition/dto/role.dto';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';

@Controller('exhibitions')
export class ExhibitionController {
    constructor(private readonly exhibitionService: ExhibitionService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    getExhibitionById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.exhibitionService.findExhibitionById(id, query.populate);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    getExhibitions(@Paginate() query: PaginateQuery) {
        return this.exhibitionService.findExhibitions(query);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    createExhibition(@Body() exhibition: ExhibitionDto) {
        return this.exhibitionService.createExhibition(exhibition);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
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

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
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

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
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
