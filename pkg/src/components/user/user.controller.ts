import { Body, Controller, Post, Req } from '@nestjs/common';
import { User as UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    createUser(@Req() req, @Body() user: UserDto) {
        const header = req.get('role');
        return this.userService.createUser(header, user);
    }
}
