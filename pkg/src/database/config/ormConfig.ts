import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

export function OrmConfig(connectionName: string, databaseName: string): any {
    return TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            type: 'mysql',
            host: configService.get('DATABASE_HOST'),
            port: parseInt(configService.get('DATABASE_PORT')),
            username: configService.get('DATABASE_USERNAME'),
            password: configService.get('DATABASE_PASSWORD'),
            database: configService.get(databaseName),
            synchronize: false,
            autoLoadEntities: true,
            connectTimeout: parseInt(
                configService.get('DATABASE_CONNECTION_TIMEOUT'),
            ),
            extra: {
                connectionLimit: parseInt(
                    configService.get('DATABASE_CONNECTION_LIMIT'),
                ),
            },
            entities: ['dist/**/entities/*{.ts,.js}'],
            cli: {
                entitiesDir: '@/components/**/entities',
            },
        }),
        inject: [ConfigService],
        name: connectionName,
    });
}
