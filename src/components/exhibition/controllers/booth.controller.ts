import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { BoothService } from '@/components/exhibition/services/booth.service';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/components/exhibition/dto/role.dto';
import { Booking as BookingDto } from '@/components/exhibition/dto/booking.dto';

@Controller('booths')
export class BoothController {
    constructor(private readonly boothService: BoothService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Get()
    getBooths(
        @JwtAccessToken() jwtAccessToken: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.boothService.findBooths(jwtAccessToken, query);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    deleteBooth(@Param('id') id: string) {
        return this.boothService.deleteBooth(id);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post(':id/booking')
    createBooking(@Param('id') id: string, @Body() bookingDto: BookingDto) {
        console.log(bookingDto);
        return this.boothService.createBooking(id, bookingDto);
    }
}
