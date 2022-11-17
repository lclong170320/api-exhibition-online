import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { DbConnection } from '@/database/config/db';

import { Booth } from '@/components/exhibition/entities/booth.entity';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { lastValueFrom, map } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from '../dto/login-payload.dto';
import { User } from '../dto/user.dto';
import { BoothListConverter } from '../converters/booth-list.converter';

@Injectable()
export class BoothService {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly boothListConverter: BoothListConverter,
        private readonly jwtService: JwtService,
    ) {}

    async findBooths(jwtAccessToken: string, populate: string[]) {
        const allowPopulate = [
            'boothImages.boothTemplatePosition',
            'boothProjects.boothTemplatePosition',
            'boothProducts.boothTemplatePosition',
            'boothProducts.boothTemplatePosition',
            'boothVideos.boothTemplatePosition',
            'boothTemplate',
            'location',
        ];

        populate.forEach((value) => {
            if (!allowPopulate.includes(value)) {
                throw new BadRequestException(
                    'Query value is not allowed ' + value,
                );
            }
        });
        let firstBooths = [];
        let count = 0;
        const decodedJwtAccessToken = this.jwtService.decode(
            jwtAccessToken,
        ) as LoginPayload;
        const firstUser = await this.getUserById(decodedJwtAccessToken.user.id);
        const firstEnterprise = await this.getEnterpriseById(firstUser.id);
        const boothRepository = this.dataSource.getRepository(Booth);

        firstUser.role.name === 'admin'
            ? ([firstBooths, count] = await boothRepository.findAndCount({
                  relations: [
                      'liveStreams',
                      'boothProducts',
                      'boothProjects',
                      'boothVideos',
                      'boothImages',
                      'boothProducts.product',
                      'boothImages.image',
                      'boothProjects.project',
                      'boothVideos.video',
                      ...populate,
                  ],
              }))
            : ([firstBooths, count] = await boothRepository.findAndCount({
                  where: {
                      enterpriseId: firstEnterprise,
                  },
                  relations: [
                      'liveStreams',
                      'boothProducts',
                      'boothProjects',
                      'boothVideos',
                      'boothImages',
                      'boothProducts.product',
                      'boothImages.image',
                      'boothProjects.project',
                      'boothVideos.video',
                      ...populate,
                  ],
              }));
        if (firstBooths.length === 0) {
            throw new NotFoundException(
                `The booth is not found: enterprise_id: ${firstEnterprise}`,
            );
        }
        return this.boothListConverter.toDto(count, firstBooths);
    }

    private async getUserById(id: number): Promise<User> {
        const url = this.configService.get('GETTING_USER_URL');
        const firstUser = this.httpService.get(`${url}/${id}?populate=role`);
        const response = firstUser.pipe(
            map((res) => {
                return res.data;
            }),
        );
        const parseValueEnterprise = await lastValueFrom(response);

        if (!parseValueEnterprise) {
            throw new BadRequestException("The 'user_id' is not found");
        }

        return parseValueEnterprise;
    }

    private async getEnterpriseById(id: number): Promise<number> {
        const url = this.configService.get('GETTING_ENTERPRISE_URL');
        const firstEnterprise = this.httpService.get(`${url}/${id}`);
        const response = firstEnterprise.pipe(
            map((res) => {
                return res.data;
            }),
        );
        const parseValueEnterprise = await lastValueFrom(response);

        if (!parseValueEnterprise) {
            throw new BadRequestException("The 'enterprise_id' is not found");
        }

        return parseValueEnterprise.id;
    }
}
