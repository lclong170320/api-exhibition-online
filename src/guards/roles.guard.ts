import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
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

        const role = user['user'].role.name;
        if (!requireRoles.includes(role)) {
            throw new ForbiddenException(`The role ${role} is not permission`);
        }
        return true;
    }
}
