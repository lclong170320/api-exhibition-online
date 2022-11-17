import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User as UserDto } from '../dto/user.dto';
import { JWTAuthGuard } from '../guards/auth.guard';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JWTAuthGuard)
    @Post()
    createUser(@Body() user: UserDto) {
        return this.userService.createUser(user);
    }

    @Get(':id')
    getUserById(@Param('id') id: string, @Paginate() query: PaginateQuery) {
        return this.userService.getUserById(id, query.populate);
    }
}
