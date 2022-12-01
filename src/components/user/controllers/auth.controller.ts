import { JwtAccessToken } from '@/decorators/jwt-access-token.decorator';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Request } from 'express';
import { Login } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() login: Login) {
        return await this.authService.login(login);
    }

    @Get('logout')
    async async(@Req() req: Request) {
        const jwtAccessToken = req.get('Authorization')
            ? req.get('Authorization').split(' ')[1]
            : undefined;
        jwtAccessToken ? await this.authService.logout(jwtAccessToken) : '';
    }

    @Get('me')
    readAuthMe(@JwtAccessToken() jwtAccessToken: string) {
        return this.authService.readAuthMe(jwtAccessToken);
    }

    @Cron(CronExpression.EVERY_HOUR)
    handleCron() {
        this.authService.removeExpiredToken();
    }
}
