import { DbConnection } from '@/database/config/db';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InformationConverter } from './converters/information.converter';
import { UserConverter } from './converters/user.converter';
import { User as UserDto } from './dto/user.dto';
import { Information } from './entities/information.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User, DbConnection.userCon)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Information, DbConnection.userCon)
        private readonly informationRepository: Repository<Information>,
        @InjectRepository(Role, DbConnection.userCon)
        private readonly rolesRepository: Repository<Role>,
        private readonly userConverter: UserConverter,
        private readonly informationConverter: InformationConverter,
    ) {}

    async createUser(header: string, userDto: UserDto): Promise<UserDto> {
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
        if (header === 'admin_system' || header === 'admin') {
            if (
                header === 'admin' &&
                (role.slug === 'admin_system' || role.slug === 'admin')
            ) {
                throw new BadRequestException(
                    `The 'role' ${header} must be staff or customer`,
                );
            }
            const salt = await bcrypt.genSalt();
            userDto.password = await bcrypt.hash(userDto.password, salt);

            const newUserEntity = this.userConverter.toEntity(userDto);
            newUserEntity.role = role;
            const savedUser = await this.usersRepository.save(newUserEntity);
            if (savedUser) {
                const informationEntity = this.informationConverter.toEntity(
                    userDto.information,
                );
                informationEntity.user = savedUser;
                savedUser.information = await this.informationRepository.save(
                    informationEntity,
                );
                return this.userConverter.toDto(savedUser);
            }
        } else throw new BadRequestException("'role' has no permissions");
    }
}
