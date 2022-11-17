import { SetMetadata } from '@nestjs/common';
import { Role } from '@/components/exhibition/dto/role.dto';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
