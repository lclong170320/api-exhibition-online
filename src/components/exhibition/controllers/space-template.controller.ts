import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    UseGuards,
    Delete,
    HttpCode,
} from '@nestjs/common';
import { SpaceTemplateService } from '@/components/exhibition/services/space-template.service';
import { PaginateQuery, Paginate } from '@/decorators/paginate.decorator';
import { SpaceTemplate as SpaceTemplateDto } from '@/components/exhibition/dto/space-template.dto';
import { Role } from '@/components/exhibition/dto/role.dto';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { CurrentUser } from '@/decorators/current-user';
import { User } from '@/components/exhibition/dto/user.dto';
import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';
import { JWTAuthGuard } from 'guards/auth.guard';

@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('space-templates')
export class SpaceTemplateController {
    constructor(private readonly spaceTemplateService: SpaceTemplateService) {}

    @Roles(Role.ADMIN)
    @Get()
    readSpaceTemplates(@Paginate() query: PaginateQuery) {
        return this.spaceTemplateService.readSpaceTemplates(query);
    }

    @Roles(Role.ADMIN)
    @Get(':id')
    readSpaceTemplateById(
        @Param('id') id: string,
        @Paginate() query: PaginateQuery,
    ) {
        return this.spaceTemplateService.readSpaceTemplateById(id, query);
    }

    @Roles(Role.ADMIN)
    @Post()
    createSpaceTemplate(
        @JwtAccessToken() jwtAccessToken: string,
        @CurrentUser() user: User,
        @Body() spaceTemplateDto: SpaceTemplateDto,
    ) {
        return this.spaceTemplateService.createSpaceTemplate(
            jwtAccessToken,
            user,
            spaceTemplateDto,
        );
    }

    @Delete(':id')
    @HttpCode(204)
    deleteSpaceTemplate(@Param('id') id: string) {
        return this.spaceTemplateService.deleteSpaceTemplate(id);
    }
}
