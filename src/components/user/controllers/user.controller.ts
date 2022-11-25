import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { User as UserDto } from '../dto/user.dto';
import { UpdateUser } from '../dto/user-update.dto';
import { JWTAuthGuard } from '../guards/auth.guard';
import { UserService } from '../services/user.service';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/components/exhibition/dto/role.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    createUser(@Body() user: UserDto) {
        return this.userService.createUser(user);
    }

    @Get(':id')
    getUserById(@Param('id') id: string, @Paginate() query: PaginateQuery) {
        return this.userService.getUserById(id, query.populate);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() user: UpdateUser) {
        return this.userService.updateUser(id, user);
    }
}
