import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import jwt_decode from 'jwt-decode';
import { LoginPayload } from '@/components/user/dto/login-payload.dto';

export const UserIdFromToken = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): number => {
        const request: Request = ctx.switchToHttp().getRequest();
        const jwtAccessToken = request.get('Authorization').split(' ')[1];

        const decodedJwtAccessToken = jwt_decode(
            jwtAccessToken,
        ) as LoginPayload;

        return decodedJwtAccessToken.user.id;
    },
);
