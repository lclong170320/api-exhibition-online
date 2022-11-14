import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Request } from 'express';
import { Login } from '../dto/login.dto';
import { JWTAuthGuard } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() login: Login) {
        return await this.authService.login(login);
    }

    @UseGuards(JWTAuthGuard)
    @Get('logout')
    async async(@Req() req: Request) {
        const jwtAccessToken = req.get('Authorization').split(' ')[1];
        jwtAccessToken ? await this.authService.logout(jwtAccessToken) : '';
    }

    @Cron(CronExpression.EVERY_HOUR)
    handleCron() {
        this.authService.removeExpiredToken();
    }
}