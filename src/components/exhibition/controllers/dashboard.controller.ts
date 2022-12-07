import { Role } from '@/components/exhibition/dto/role.dto';
import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'guards/auth.guard';
import { RolesGuard } from 'guards/roles.guard';
import { DashboardService } from '../services/dashboard.service';

@Controller('dashboards')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    readDashboard(@JwtAccessToken() jwtAccessToken: string) {
        return this.dashboardService.readDashboard(jwtAccessToken);
    }
}
