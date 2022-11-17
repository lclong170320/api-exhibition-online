import { DbConnection } from '@/database/config/db';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UserConverter } from '../converters/user.converter';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { User as UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly userConverter: UserConverter,
        @InjectDataSource(DbConnection.userCon)
        private readonly dataSource: DataSource,
    ) {}
    async getUserById(id: string, populate: string[]): Promise<User> {
        const allowPopulate = ['role'];
        const userRepository = this.dataSource.manager.getRepository(User);
        populate.forEach((value) => {
            if (!allowPopulate.includes(value)) {
                throw new BadRequestException(
                    'Query value is not allowed ' + value,
                );
            }
        });
        const user = await userRepository.findOne({
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

    async createUser(userDto: UserDto): Promise<UserDto> {
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
        const salt = await bcrypt.genSalt();
        userDto.password = await bcrypt.hash(userDto.password, salt);
        const newUserEntity = this.userConverter.toEntity(userDto);
        newUserEntity.role = role;
        const savedUser = await userRepository.save(newUserEntity);
        return this.userConverter.toDto(savedUser);
    }
    async findAccount(email: string): Promise<User> {
        const userRepository = this.dataSource.manager.getRepository(User);
        const user = await userRepository.findOne({
            where: {
                email: email,
            },
            relations: ['role'],
        });
        return user;
    }

    async findOneByEmail(email: string): Promise<User> {
        const userRepository = this.dataSource.manager.getRepository(User);
        const user = await userRepository.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new BadRequestException(`The ${email} is not found`);
        }
        return user;
    }

    async updateUser(id: string, userDto: UserDto) {
        const userRepository = this.dataSource.manager.getRepository(User);
        const user = await userRepository.findOneBy({ id: parseInt(id) });
        if (!user) {
            throw new BadRequestException(`The user_id: ${id} is not found`);
        }
        if (userDto.password) {
            const salt = await bcrypt.genSalt();
            userDto.password = await bcrypt.hash(userDto.password, salt);
        }
        const userEntity = this.userConverter.toEntity(userDto);
        const userNew = await userRepository.save({ ...user, ...userEntity });
        return this.userConverter.toDto(userNew);
    }
}
