import { Body, Controller, Param, Put } from '@nestjs/common';
import { Space as SpaceDto } from '@/components/exhibition/dto/space.dto';
import { SpaceService } from '@/components/exhibition/services/space.service';

@Controller('spaces')
export class SpaceController {
    constructor(private readonly spaceService: SpaceService) {}

    @Put(':id')
    updateSpace(@Param('id') id: string, @Body() spaceDto: SpaceDto) {
        return this.spaceService.updateSpace(id, spaceDto);
    }
}
