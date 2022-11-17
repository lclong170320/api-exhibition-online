import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { LoginPayload } from '../dto/login-payload.dto';
import { Paginate, PaginateQuery } from '@/decorators/paginate.decorator';
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    Req,
} from '@nestjs/common';
import { User as UserDto } from '../dto/user.dto';
import { JWTAuthGuard } from '../guards/auth.guard';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    @UseGuards(JWTAuthGuard)
    @Post()
    createUser(@Req() req: Request, @Body() user: UserDto) {
        const jwtAccessToken = req.get('Authorization').split(' ')[1];
        const verifiedJwtAccessToken = this.jwtService.verify(jwtAccessToken, {
            publicKey: Buffer.from(
                this.configService.get<string>('JWT_PUBLIC_KEY'),
                'base64',
            ).toString('utf8'),
            algorithms: ['RS256'],
        }) as LoginPayload;
        return this.userService.createUser(
            verifiedJwtAccessToken.user.role.name,
            user,
        );
    }

    @Get(':id')
    getUserById(@Param('id') id: string, @Paginate() query: PaginateQuery) {
        return this.userService.getUserById(id, query.populate);
    }
}
