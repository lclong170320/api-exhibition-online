import { DbConnection } from '@/database/config/db';
import {
    Injectable,
    ExecutionContext,
    CallHandler,
    ForbiddenException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Observable } from 'rxjs';
import { Request } from 'express';
import jwt_decode from 'jwt-decode';
import { LoginPayload } from '@/components/user/dto/login-payload.dto';
import { Exhibition } from '@/components/exhibition/entities/exhibition.entity';

@Injectable()
export class AllowUserGetExhibtion {
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
            const exhibitionRepository =
                this.dataSource.manager.getRepository(Exhibition);
            const findExhibition = await exhibitionRepository.findOne({
                where: {
                    booths: {
                        enterpriseId: decodedJwtAccessToken.user.enterprise_id,
                    },
                    id: parseInt(request.params.id),
                },
            });

            if (!findExhibition) {
                throw new ForbiddenException();
            }
        }

        return next.handle();
    }
}
