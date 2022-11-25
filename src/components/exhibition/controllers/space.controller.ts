import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Space as SpaceDto } from '@/components/exhibition/dto/space.dto';
import { SpaceService } from '@/components/exhibition/services/space.service';
import { PaginateQuery, Paginate } from '@/decorators/paginate.decorator';
import { Role } from '@/components/exhibition/dto/role.dto';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { JWTAuthGuard } from '@/components/user/guards/auth.guard';

@Controller('spaces')
export class SpaceController {
    constructor(private readonly spaceService: SpaceService) {}

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    getBoothById(@Param('id') id: string, @Paginate() query: PaginateQuery) {
        return this.spaceService.getSpaceById(id, query.populate);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put(':id')
    updateSpace(@Param('id') id: string, @Body() spaceDto: SpaceDto) {
        return this.spaceService.updateSpace(id, spaceDto);
    }
}
