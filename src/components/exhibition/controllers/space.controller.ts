import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Space as SpaceDto } from '@/components/exhibition/dto/space.dto';
import { SpaceService } from '@/components/exhibition/services/space.service';

@Controller('spaces')
export class SpaceController {
    constructor(private readonly spaceService: SpaceService) {}

    @Get(':id')
    getBoothById(@Param('id') id: string) {
        return this.spaceService.getSpaceById(id);
    }

    @Put(':id')
    updateSpace(@Param('id') id: string, @Body() spaceDto: SpaceDto) {
        return this.spaceService.updateSpace(id, spaceDto);
    }
}
