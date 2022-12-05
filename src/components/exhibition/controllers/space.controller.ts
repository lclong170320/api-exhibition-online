import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Space as SpaceDto } from '@/components/exhibition/dto/space.dto';
import { SpaceService } from '@/components/exhibition/services/space.service';
import { PaginateQuery, Paginate } from '@/decorators/paginate.decorator';
import { Role } from '@/components/exhibition/dto/role.dto';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';
import { JWTAuthGuard } from 'guards/auth.guard';

@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('spaces')
export class SpaceController {
    constructor(private readonly spaceService: SpaceService) {}

    @Roles(Role.ADMIN)
    @Get(':id')
    readBoothById(@Param('id') id: string, @Paginate() query: PaginateQuery) {
        return this.spaceService.readSpaceById(id, query.populate);
    }

    @Roles(Role.ADMIN)
    @Put(':id')
    updateSpace(
        @JwtAccessToken() jwtAccessToken: string,
        @Param('id') id: string,
        @Body() spaceDto: SpaceDto,
    ) {
        return this.spaceService.updateSpace(jwtAccessToken, id, spaceDto);
    }
}
