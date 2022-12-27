import { Booth } from '@/components/exhibition/entities/booth.entity';
import { LoginPayload } from '@/components/user/dto/login-payload.dto';
import { DbConnection } from '@/database/config/db';
import {
    CallHandler,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class AllowUserGetExhibitionBooth {
    constructor(
        @InjectDataSource(DbConnection.exhibitionCon)
        private readonly dataSource: DataSource,
    ) {}
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any> | Promise<Observable<any>>> {
        const request: Request = context.switchToHttp().getRequest();
        const jwtAccessToken = request.get('Authorization').split(' ')[1];
        const decodedJwtAccessToken = jwt_decode(
            jwtAccessToken,
        ) as LoginPayload;

        if (decodedJwtAccessToken.user.role.name === 'user') {
            const boothRepository =
                this.dataSource.manager.getRepository(Booth);
            const findBoothsByEnterpriseId = await boothRepository.findOne({
                where: {
                    enterpriseId: decodedJwtAccessToken.user.enterprise_id,
                    id: parseInt(request.params.boothId),
                    exhibition: {
                        id: parseInt(request.params.exhibitionId),
                    },
                },
            });

            if (!findBoothsByEnterpriseId) {
                throw new ForbiddenException();
            }
        }

        return next.handle();
    }
}
