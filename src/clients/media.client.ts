import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class MediaClientService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

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

    async createUrlMedias(
        data: string,
        jwtAccessToken: string,
    ): Promise<number> {
        const requestConfig = {
            maxBodyLength: Infinity,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtAccessToken}`,
            },
        };
        const url = this.configService.get('CREATING_MEDIA_URL');
        const media = this.httpService.post(url, { data }, requestConfig);
        const response = media.pipe(
            map((res) => {
                return res.data;
            }),
        );
        const result = await lastValueFrom(response);

        return result.id;
    }
}
