import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class UserClientService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    async getEnterpriseIdFromToken(
        jwtAccessToken: string,
        id: number,
    ): Promise<number> {
        const config = {
            headers: { Authorization: `Bearer ${jwtAccessToken}` },
        };
        const url = this.configService.get('GETTING_USER_URL');
        const firstUser = this.httpService.get(
            `${url}/${id}?populate=role`,
            config,
        );
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

    async getUserByEnterpriseId(jwtAccessToken: string, id: number) {
        const config = {
            headers: { Authorization: `Bearer ${jwtAccessToken}` },
        };
        const url = this.configService.get('GETTING_USER_URL');
        const firstUser = this.httpService.get(
            `${url}?limit=100&filter=enterpriseId:${id}`,
            config,
        );
        const response = firstUser.pipe(
            map((res) => {
                return res.data;
            }),
        );
        const parseValueEnterprise = await lastValueFrom(response);

        if (!parseValueEnterprise) {
            throw new BadRequestException("The 'enterprise id' is not found");
        }

        return parseValueEnterprise;
    }
}
