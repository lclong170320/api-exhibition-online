import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UpdateUser } from '@/components/user/dto/user-update.dto';
import { JWTAuthGuard } from 'guards/auth.guard';
import { UserService } from '@/components/user/services/user.service';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/components/exhibition/dto/role.dto';
import { CurrentUser } from '@/decorators/current-user';
import { User as UserDto } from '@/components/user/dto/user.dto';
import { Password as PasswordDto } from '@/components/user/dto/password.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('forgot-password')
    forgotPassword(@Query('email') email: string) {
        return this.userService.forgotPassword(email);
    }

    @Get('reset-password')
    resetPassword(@Query('key') key: string) {
        return this.userService.resetPassword(key);
    }

    @Patch(':id/password')
    newPassword(@Param('id') id: string, @Body('value') password: string) {
        return this.userService.newPassword(id, password);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    createUser(@Body() userDto: UserDto, @CurrentUser() user: UserDto) {
        return this.userService.createUser(userDto, user);
    }

    @Get(':id')
    readUserById(@Param('id') id: string, @Paginate() query: PaginateQuery) {
        return this.userService.readUserById(id, query);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    readUsers(@Paginate() query: PaginateQuery) {
        return this.userService.readUsers(query);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Post('change-password')
    @HttpCode(204)
    changePassword(
        @CurrentUser() user: UserDto,
        @Body() passwordDto: PasswordDto,
    ) {
        return this.userService.changePassword(user, passwordDto);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() user: UpdateUser) {
        return this.userService.updateUser(id, user);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}
