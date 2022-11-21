import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class UtilService {
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

    async getMediaUrl(id: number): Promise<string> {
        const url = this.configService.get('CREATING_MEDIA_URL');
        const media = this.httpService.get(`${url}/${id}`);

        if (!media) {
            throw new NotFoundException('Not found');
        }
        const response = media.pipe(
            map((res) => {
                return res.data;
            }),
        );
        const result = await lastValueFrom(response);

        return result.url;
    }
}
