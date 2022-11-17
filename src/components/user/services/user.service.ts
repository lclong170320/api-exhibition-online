import { DbConnection } from '@/database/config/db';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserConverter } from '../converters/user.converter';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { User as UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User, DbConnection.userCon)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Role, DbConnection.userCon)
        private readonly rolesRepository: Repository<Role>,
        private readonly userConverter: UserConverter,
    ) {}

    async getUserById(id: string, populate: string[]): Promise<User> {
        const allowPopulate = ['role'];

        populate.forEach((value) => {
            if (!allowPopulate.includes(value)) {
                throw new BadRequestException(
                    'Query value is not allowed ' + value,
                );
            }
        });
        const user = await this.usersRepository.findOne({
            where: {
                id: parseInt(id),
            },
            relations: populate,
        });
        if (!user) {
            throw new BadRequestException("The 'user_id' is not found: " + id);
        }
        return user;
    }

    private readonly ADMIN_ROLE = 'admin';
    async createUser(roleAuth: string, userDto: UserDto): Promise<UserDto> {
        const role = await this.rolesRepository.findOne({
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
        if (roleAuth === this.ADMIN_ROLE) {
            const salt = await bcrypt.genSalt();
            userDto.password = await bcrypt.hash(userDto.password, salt);
            const newUserEntity = this.userConverter.toEntity(userDto);
            newUserEntity.role = role;
            const savedUser = await this.usersRepository.save(newUserEntity);
            return this.userConverter.toDto(savedUser);
        } else
            throw new BadRequestException(
                `The 'role' ${roleAuth} has no permissions`,
            );
    }
    async findAccount(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: {
                email: email,
            },
            relations: ['role'],
        });
        return user;
    }

    async findOneByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new BadRequestException(`The ${email} is not found`);
        }
        return user;
    }
}
