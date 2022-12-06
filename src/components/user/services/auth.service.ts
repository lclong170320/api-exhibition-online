import { DbConnection } from '@/database/config/db';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UserConverter } from '../converters/user.converter';
import { LoginPayload } from '../dto/login-payload.dto';
import { Login } from '../dto/login.dto';
import { Blacklist } from '../entities/blacklist.entity';
import { User } from '../entities/user.entity';
@Injectable()
export class AuthService {
    constructor(
        private readonly userConverter: UserConverter,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectDataSource(DbConnection.userCon)
        private readonly dataSource: DataSource,
    ) {}
    private readonly publicKey = Buffer.from(
        this.configService.get<string>('JWT_PUBLIC_KEY'),
        'base64',
    ).toString('ascii');
    private readonly privateKey = Buffer.from(
        this.configService.get<string>('JWT_PRIVATE_KEY'),
        'base64',
    ).toString('ascii');

    async validateUserCredentials(
        email: string,
        password: string,
    ): Promise<User> {
        const userRepository = this.dataSource.manager.getRepository(User);
        const user = await userRepository.findOne({
            where: {
                email: email,
            },
            relations: ['role'],
        });
        if (!user) {
            throw new UnauthorizedException('invalid user');
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw new UnauthorizedException('invalid password');
        }
        return user;
    }

    async issueAccessToken(user: User): Promise<Login> {
        const userDto = this.userConverter.toDto(user);
        return {
            access_token: this.jwtService.sign(
                { user: userDto },
                {
                    privateKey: this.privateKey,
                    algorithm: 'RS256',
                    expiresIn: '1h',
                },
            ),
        } as Login;
    }

    async login(login: Login) {
        const user = await this.validateUserCredentials(
            login.email,
            login.password,
        );
        return await this.issueAccessToken(user);
    }

    async logout(token: string) {
        const blacklistRepository =
            this.dataSource.manager.getRepository(Blacklist);
        const verifyToken = this.jwtService.verify(token, {
            publicKey: this.publicKey,
            ignoreExpiration: true,
        }) as LoginPayload;
        if (verifyToken) await blacklistRepository.save({ token: token });
    }

    async removeExpiredToken() {
        const blacklistRepository =
            this.dataSource.manager.getRepository(Blacklist);
        const blacklist = await blacklistRepository.find();
        blacklist?.map((data) => {
            const decodedJwtAccessToken = this.jwtService.decode(
                data.token,
            ) as LoginPayload;
            new Date().valueOf() >=
            new Date(decodedJwtAccessToken.exp).valueOf() * 1000
                ? blacklistRepository.delete(data.id)
                : '';
        });
    }

    async readAuthMe(jwtAccessToken: string) {
        const blacklistRepository =
            this.dataSource.manager.getRepository(Blacklist);
        const result = await blacklistRepository.findOne({
            where: {
                token: jwtAccessToken,
            },
        });
        if (result) throw new UnauthorizedException('Expired token');
        const userRepository = this.dataSource.manager.getRepository(User);
        let payload: LoginPayload;
        try {
            payload = this.jwtService.verify(jwtAccessToken, {
                publicKey: this.publicKey,
            });
        } catch (e) {
            throw new UnauthorizedException(e);
        }
        const user = await userRepository.findOne({
            where: {
                id: payload.user.id,
            },
            relations: ['role'],
        });
        if (!user) throw new UnauthorizedException('Invalid user');
        return this.userConverter.toDto(user);
    }
}
