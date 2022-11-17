import { DbConnection } from '@/database/config/db';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { RoleConverter } from './converters/role.converter';
import { UserConverter } from './converters/user.converter';
import { Blacklist } from './entities/blacklist.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JWTStrategy } from './strategies/jwt.strategy';

@Module({
    controllers: [UserController, AuthController],
    providers: [
        UserService,
        UserConverter,
        RoleConverter,
        JWTStrategy,
        JwtService,
        AuthService,
        UserConverter,
        RoleConverter,
    ],
    imports: [
        TypeOrmModule.forFeature([User, Role, Blacklist], DbConnection.userCon),
        ScheduleModule.forRoot(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                privateKey: Buffer.from(
                    configService.get<string>('JWT_PRIVATE_KEY'),
                    'base64',
                ).toString('ascii'),
                publicKey: Buffer.from(
                    configService.get<string>('JWT_PUBLIC_KEY'),
                    'base64',
                ).toString('utf8'),
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [TypeOrmModule, UserService],
})
export class UserModule {}
