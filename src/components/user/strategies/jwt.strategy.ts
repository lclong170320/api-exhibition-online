import { LoginPayload } from '@/components/user/dto/login-payload.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: Buffer.from(
                configService.get<string>('JWT_PUBLIC_KEY'),
                'base64',
            ).toString('utf8'),
        });
    }

    async validate(payload: LoginPayload) {
        return payload;
    }
}
