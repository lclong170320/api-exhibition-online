import { LoginPayload } from '@/components/user/dto/login-payload.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { Request } from 'express';
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
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
        await this.authService.checkToken(token);
        return payload;
    }
}
