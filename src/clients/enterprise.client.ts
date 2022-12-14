import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { PaginateQuery } from '@/decorators/paginate.decorator';

@Injectable()
export class EnterpriseClientService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    async checkEnterprise(id: number): Promise<boolean> {
        const url = this.configService.get('GETTING_ENTERPRISE_URL');
        const query: PaginateQuery = {
            withDeleted: true,
        };
        const firstEnterprise = this.httpService.get(
            `${url}/${id}?withDeleted=${query.withDeleted}`,
        );
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

    async getEnterprises(jwtAccessToken: string) {
        const config = {
            headers: { Authorization: `Bearer ${jwtAccessToken}` },
        };
        const url = this.configService.get('GETTING_ENTERPRISE_URL');
        const firstUser = this.httpService.get(`${url}`, config);
        const response = firstUser.pipe(
            map((res) => {
                return res.data;
            }),
        );
        const parseValueEnterprise = await lastValueFrom(response);

        return parseValueEnterprise;
    }
}
