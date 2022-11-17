import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const JwtAccessToken = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): string => {
        const request: Request = ctx.switchToHttp().getRequest();
        const jwtAccessToken = request.get('Authorization').split(' ')[1];

        return jwtAccessToken;
    },
);
