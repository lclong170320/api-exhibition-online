import { DbConnection } from '@/database/config/db';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UserConverter } from '@/components/user/converters/user.converter';
import { Role } from '@/components/user/entities/role.entity';
import { User } from '@/components/user/entities/user.entity';
import { User as UserDto } from '@/components/user/dto/user.dto';
import { UpdateUser } from '@/components/user/dto/user-update.dto';
import { Password as PasswordDto } from '@/components/user/dto/password.dto';
import { keys } from 'lodash';
import { PaginateQuery } from '@/decorators/paginate.decorator';
import { paginate } from '@/utils/pagination';
import { PaginatedUsersConverter } from '@/components/user/converters/paginated-users.converter';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPasswordConverter } from '@/components/user/converters/forgot-password.converter';
import generateApiKey from 'generate-api-key';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        private readonly userConverter: UserConverter,
        @InjectDataSource(DbConnection.userCon)
        private readonly dataSource: DataSource,
        private readonly paginatedUsersConverter: PaginatedUsersConverter,
        private readonly mailerService: MailerService,
        private readonly forgotPasswordConverter: ForgotPasswordConverter,
        private readonly configService: ConfigService,
    ) {}

    async readUsers(query: PaginateQuery) {
        const filterableColumns = keys(query.filter);
        const defaultSortBy = [['createdAt', 'DESC']];
        const searchableColumns = ['name', 'key', 'createdDate'];
        const populatableColumns = query.populate;

        const userRepository = this.dataSource.getRepository(User);
        const [booths, total] = await paginate(query, userRepository, {
            searchableColumns,
            filterableColumns,
            populatableColumns,
            defaultSortBy,
            withDeleted: query.withDeleted,
        });

        return this.paginatedUsersConverter.toDto(
            query.page,
            query.limit,
            total,
            booths,
        );
    }

    async readUserById(id: string, query: PaginateQuery): Promise<UserDto> {
        const userRepository = this.dataSource.manager.getRepository(User);
        const user = await userRepository.findOne({
            where: {
                id: parseInt(id),
            },
            relations: query.populate,
            withDeleted: query.withDeleted,
        });
        if (!user) {
            throw new BadRequestException("The 'user_id' is not found: " + id);
        }
        return this.userConverter.toDto(user);
    }

    async createUser(userDto: UserDto, user: UserDto): Promise<UserDto> {
        const roleRepository = this.dataSource.manager.getRepository(Role);
        const userRepository = this.dataSource.manager.getRepository(User);
        const role = await roleRepository.findOne({
            where: {
                id: userDto.role_id,
            },
        });
        if (!role) {
            throw new BadRequestException(
                "The 'role_id' is not found: " + userDto.role_id,
            );
        }
        // TODO
        userDto.password = await this.hashPassword(userDto.password);
        const newUserEntity = this.userConverter.toEntity(userDto);
        newUserEntity.role = role;
        newUserEntity.createdBy = user.id;
        const savedUser = await userRepository.save(newUserEntity);
        return this.userConverter.toDto(savedUser);
    }

    async updateUser(id: string, userUpdateDto: UpdateUser) {
        const userRepository = this.dataSource.manager.getRepository(User);
        const roleRepository = this.dataSource.manager.getRepository(Role);
        const user = await userRepository.findOneBy({ id: parseInt(id) });
        if (!user) {
            throw new BadRequestException(`The user_id: ${id} is not found`);
        }
        const role = await roleRepository.findOne({
            where: {
                id: userUpdateDto.role_id,
            },
        });
        if (!role) {
            throw new ForbiddenException(
                "The 'role_id' is not found: " + userUpdateDto.role_id,
            );
        }
        if (userUpdateDto.password) {
            user.password = await this.hashPassword(userUpdateDto.password);
        }
        user.email = userUpdateDto.email;
        user.name = userUpdateDto.name;
        user.phone = userUpdateDto.phone;
        user.role = role;
        user.status = userUpdateDto.status;
        user.enterpriseId = userUpdateDto.enterprise_id;
        const userNew = await userRepository.save({ ...user });
        return this.userConverter.toDto(userNew);
    }

    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    async changePassword(user: UserDto, passwordDto: PasswordDto) {
        const userRepository = this.dataSource.getRepository(User);
        const firstUser = await userRepository.findOneBy({
            id: user.id,
        });
        if (!firstUser) {
            throw new NotFoundException('The user_id not found');
        }

        const passwordCompare = await bcrypt.compare(
            passwordDto.current_password,
            firstUser.password,
        );
        if (!passwordCompare) {
            throw new UnauthorizedException('invalid password');
        }
        firstUser.password = await this.hashPassword(passwordDto.password);

        const updatedUser = await userRepository.save(firstUser);

        return this.userConverter.toDto(updatedUser);
    }

    async deleteUser(id: string) {
        await this.dataSource.transaction(async (manager) => {
            const userRepository = manager.getRepository(User);

            const firstUser = await userRepository.findOneBy({
                id: parseInt(id),
            });

            if (!firstUser) {
                throw new NotFoundException('Not found');
            }

            await userRepository.softRemove(firstUser);
        });
    }

    async forgotPassword(email: string) {
        const userRepository = this.dataSource.manager.getRepository(User);
        const firstUser = await userRepository.findOne({
            where: {
                email: email,
            },
        });

        if (!firstUser) {
            throw new BadRequestException(
                `The user not found: email: ${email}`,
            );
        }

        const randomKey = generateApiKey({ method: 'uuidv4', dashes: false });

        firstUser.key = randomKey.toString();

        await userRepository.save(firstUser);

        this.sendMail(email, randomKey.toString());

        return this.forgotPasswordConverter.toDto(firstUser);
    }

    private async sendMail(email: string, randomKey: string) {
        this.mailerService.sendMail({
            to: email,
            subject: 'Đặt lại mật khẩu',
            template: './email',
            context: {
                randomKey: randomKey,
                host: this.configService.get('DATABASE_HOST'),
                link: this.configService.get('Link_Change_Password'),
            },
        });
    }

    async resetPassword(key: string) {
        const userRepository = this.dataSource.manager.getRepository(User);
        const firstKey = await userRepository.findOne({
            where: {
                key: key,
            },
        });
        if (!firstKey) {
            throw new BadRequestException(`The key not found: ${key}`);
        }
        return this.userConverter.toDto(firstKey);
    }

    async newPassword(id: string, password: string) {
        const userRepository = this.dataSource.getRepository(User);
        const firstUser = await userRepository.findOneBy({
            id: parseInt(id),
        });
        if (!firstUser) {
            throw new NotFoundException(`The user_id ${id} not found`);
        }

        firstUser.password = await this.hashPassword(password);
        firstUser.key = null;

        await userRepository.save(firstUser);
        return this.userConverter.toDto(firstUser);
    }
}
