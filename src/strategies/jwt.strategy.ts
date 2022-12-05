import { LoginPayload } from '@/components/user/dto/login-payload.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: Buffer.from(
                configService.get<string>('JWT_PUBLIC_KEY'),
                'base64',
            ).toString('ascii'),
            passReqToCallback: true,
        });
    }
    async validate(req: Request, payload: LoginPayload) {
        const token = req.get('Authorization').split(' ')[1];
        const url = this.configService.get('GETTING_AUTH_URL');
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const check = this.httpService.get(`${url}/me`, config);
        const response = check.pipe(
            map((res) => {
                return res.data;
            }),
            catchError(() => {
                throw new UnauthorizedException();
            }),
        );
        await lastValueFrom(response);
        return payload;
    }
}
