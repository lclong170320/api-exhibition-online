import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    HttpCode,
    UseGuards,
} from '@nestjs/common';
import { BoothTemplateService } from '@/components/exhibition/services/booth-template.service';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { BoothTemplate as BoothTemplateDto } from '@/components/exhibition/dto/booth-template.dto';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/components/exhibition/dto/role.dto';
import { RolesGuard } from 'guards/roles.guard';
import { JWTAuthGuard } from '@/components/user/guards/auth.guard';
import { CurrentUser } from '@/decorators/current-user';
import { User } from '@/components/exhibition/dto/user.dto';
import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';

@Controller('booth-templates')
export class BoothTemplateController {
    constructor(private readonly boothTemplateService: BoothTemplateService) {}

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    readBoothTemplateById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.boothTemplateService.readBoothTemplateById(
            id,
            query.populate,
        );
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    readBoothTemplates(@Paginate() query: PaginateQuery) {
        return this.boothTemplateService.readBoothTemplates(query);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    createBoothTemplate(
        @CurrentUser() user: User,
        @JwtAccessToken() jwtAccessToken: string,
        @Body() boothTemplateDto: BoothTemplateDto,
    ) {
        return this.boothTemplateService.createBoothTemplate(
            jwtAccessToken,
            user,
            boothTemplateDto,
        );
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    deleteBoothTemplate(@Param('id') id: string) {
        return this.boothTemplateService.deleteBoothTemplate(id);
    }
}
