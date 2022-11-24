import { LoginPayload } from '@/components/user/dto/login-payload.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import jwt_decode from 'jwt-decode';

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();

        if (request.get('Authorization')) {
            const jwtAccessToken = request.get('Authorization').split(' ')[1];
            const decodedJwtAccessToken = jwt_decode(
                jwtAccessToken,
            ) as LoginPayload;

            return decodedJwtAccessToken.user;
        }

        return null;
    },
);
