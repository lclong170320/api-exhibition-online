import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class UtilService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    async getEnterpriseIdFromToken(id: number): Promise<number> {
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

        return parseValueEnterprise.enterprise_id;
    }

    async checkEnterprise(id: number): Promise<boolean> {
        const url = this.configService.get('GETTING_ENTERPRISE_URL');
        const firstEnterprise = this.httpService.get(`${url}/${id}`);
        const response = firstEnterprise.pipe(
            map((res) => {
                return res.data;
            }),
        );
        const parseValueEnterprise = await lastValueFrom(response);

        if (!parseValueEnterprise.id) {
            return false;
        }

        return true;
    }
}
