import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { BoothOrganization as BoothOrganizationDto } from '@/components/exhibition/dto/booth-organization.dto';
import { BoothOrganizationService } from '@/components/exhibition/services/booth-organization.service';
import { PaginateQuery, Paginate } from '@/decorators/paginate.decorator';
import { Role } from '@/components/exhibition/dto/role.dto';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { JWTAuthGuard } from '@/components/user/guards/auth.guard';
import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';

@Controller('booth-organizations')
export class BoothOrganizationController {
    constructor(
        private readonly boothOrganizationService: BoothOrganizationService,
    ) {}

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    readBoothOrganizationById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.boothOrganizationService.readBoothOrganizationById(
            id,
            query.populate,
        );
    }

    @Put(':id')
    updateBoothOrganization(
        @JwtAccessToken() jwtAccessToken: string,
        @Param('id') id: string,
        @Body() boothOrganizationDto: BoothOrganizationDto,
    ) {
        return this.boothOrganizationService.updateBoothOrganization(
            jwtAccessToken,
            id,
            boothOrganizationDto,
        );
    }
}
