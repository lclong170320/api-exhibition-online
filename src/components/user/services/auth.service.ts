import { DbConnection } from '@/database/config/db';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
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
        @InjectRepository(Blacklist, DbConnection.userCon)
        private readonly blacklistRepository: Repository<Blacklist>,
        @InjectRepository(User, DbConnection.userCon)
        private readonly usersRepository: Repository<User>,
    ) {}
    private readonly privateKey = Buffer.from(
        this.configService.get<string>('JWT_PRIVATE_KEY'),
        'base64',
    ).toString('ascii');
    private readonly publicKey = Buffer.from(
        this.configService.get<string>('JWT_PUBLIC_KEY'),
        'base64',
    ).toString('ascii');
    async validateUserCredentials(
        email: string,
        password: string,
    ): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: {
                email: email,
            },
            relations: ['role'],
        });
        if (!user) {
            throw new BadRequestException('invalid user');
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw new BadRequestException('invalid password');
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
        await this.blacklistRepository.save({ token: token });
    }
    async removeExpiredToken() {
        const blacklist = await this.blacklistRepository.find();
        blacklist?.map((data) => {
            const decodedJwtAccessToken = this.jwtService.decode(
                data.token,
            ) as LoginPayload;
            new Date().valueOf() >=
            new Date(decodedJwtAccessToken.exp).valueOf() * 1000
                ? this.blacklistRepository.delete(data.id)
                : '';
        });
    }
    verifiedToken(token: string) {
        return this.jwtService.verify(token, {
            publicKey: this.publicKey,
            algorithms: ['RS256'],
        }) as LoginPayload;
    }
}
