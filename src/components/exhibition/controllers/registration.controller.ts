import { Status } from '@/components/exhibition/dto/registration.dto';
import { Role } from '@/components/exhibition/dto/role.dto';
import { RegistrationService } from '@/components/exhibition/services/registration.service';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Body, Param, Patch } from '@nestjs/common/decorators';
import { JWTAuthGuard } from 'guards/auth.guard';
import { RolesGuard } from 'guards/roles.guard';

@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('registrations')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) {}

    @Roles(Role.ADMIN, Role.USER)
    @Get()
    readRegistrations(@Paginate() query: PaginateQuery) {
        return this.registrationService.readRegistrations(query);
    }

    @Roles(Role.ADMIN, Role.USER)
    @Get(':id')
    readRegistrationById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.registrationService.readRegistrationById(id, query);
    }

    @Roles(Role.ADMIN, Role.USER)
    @Patch(':id')
    async updateRegistration(
        @Param('id') id: string,
        @Body('status') status: Status,
    ) {
        return await this.registrationService.updateRegistration(id, status);
    }
}
