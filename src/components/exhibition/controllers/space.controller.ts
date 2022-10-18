import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Space as SpaceDto } from '@/components/exhibition/dto/space.dto';
import { SpaceService } from '@/components/exhibition/services/space.service';
import { PaginateQuery, Paginate } from '@/decorators/paginate.decorator';

@Controller('spaces')
export class SpaceController {
    constructor(private readonly spaceService: SpaceService) {}

    @Get(':id')
    getBoothById(@Param('id') id: string, @Paginate() query: PaginateQuery) {
        return this.spaceService.getSpaceById(id, query.populate);
    }

    @Put(':id')
    updateSpace(@Param('id') id: string, @Body() spaceDto: SpaceDto) {
        return this.spaceService.updateSpace(id, spaceDto);
    }
}
