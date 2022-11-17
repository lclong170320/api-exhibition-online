import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@/components/exhibition/dto/role.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requireRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const jwtAccessToken = request.get('Authorization').split(' ')[1];
        const user = this.jwtService.decode(jwtAccessToken);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const role = user['user'].role.name;

        // return requireRoles.includes(role); NOTE: implement login
        return true;
    }
}
