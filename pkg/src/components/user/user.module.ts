import { DbConnection } from '@/database/config/db';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformationConverter } from './converters/information.converter';
import { RoleConverter } from './converters/role.converter';
import { UserConverter } from './converters/user.converter';
import { Information } from './entities/information.entity';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        UserConverter,
        InformationConverter,
        RoleConverter,
    ],
    imports: [
        TypeOrmModule.forFeature(
            [User, Information, Role, Permission],
            DbConnection.userCon,
        ),
    ],
    exports: [TypeOrmModule],
})
export class UserModule {}
