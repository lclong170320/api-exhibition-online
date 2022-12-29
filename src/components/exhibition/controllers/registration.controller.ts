import { JWTAuthGuard } from 'guards/auth.guard';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'guards/roles.guard';
import { RegistrationService } from '@/components/exhibition/services/registration.service';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/components/exhibition/dto/role.dto';

@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('registrations')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) {}
    @Roles(Role.ADMIN)
    @Get()
    readRegistrations(@Paginate() query: PaginateQuery) {
        return this.registrationService.readRegistrations(query);
    }
}
