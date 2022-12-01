import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { ExhibitionService } from '@/components/exhibition/services/exhibition.service';
import { Exhibition as ExhibitionDto } from '@/components/exhibition/dto/exhibition.dto';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Booth as BoothDto } from '@/components/exhibition/dto/booth.dto';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '../dto/role.dto';
import { UpdateExhibition } from '../dto/exhibition-update.dto';
import { JWTAuthGuard } from '@/components/user/guards/auth.guard';
import { CurrentUser } from '@/decorators/current-user';
import { User } from '@/components/exhibition/dto/user.dto';
import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';

@Controller('exhibitions')
export class ExhibitionController {
    constructor(private readonly exhibitionService: ExhibitionService) {}

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    readExhibitionById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.exhibitionService.readExhibitionById(id, query.populate);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    readExhibitions(@Paginate() query: PaginateQuery) {
        return this.exhibitionService.readExhibitions(query);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    createExhibition(@Body() exhibition: ExhibitionDto) {
        return this.exhibitionService.createExhibition(exhibition);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    async updateExhibition(
        @Param('id') id: string,
        @Body() exhibition: UpdateExhibition,
    ) {
        return await this.exhibitionService.updateExhibition(id, exhibition);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post(':exhibitionId/booths')
    createBooth(
        @JwtAccessToken() jwtAccessToken: string,
        @CurrentUser() user: User,
        @Param('exhibitionId') exhibitionId: string,
        @Body() boothDto: BoothDto,
    ) {
        return this.exhibitionService.createBooth(
            jwtAccessToken,
            user,
            parseInt(exhibitionId),
            boothDto,
        );
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':exhibitionId/booths/:boothId')
    readBoothById(
        @Param('exhibitionId') exhibitionId: string,
        @Param('boothId') boothId: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.exhibitionService.readBoothById(
            exhibitionId,
            boothId,
            query.populate,
        );
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put(':exhibition_id/booths/:booth_id')
    updateBooth(
        @JwtAccessToken() jwtAccessToken: string,
        @CurrentUser() user: User,
        @Param('exhibition_id') exhibitionId: string,
        @Param('booth_id') boothId: string,
        @Body() boothDto: BoothDto,
    ) {
        return this.exhibitionService.updateBooth(
            jwtAccessToken,
            user,
            exhibitionId,
            boothId,
            boothDto,
        );
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    deleteExhibition(@Param('id') id: string) {
        return this.exhibitionService.deleteExhibition(id);
    }
}
