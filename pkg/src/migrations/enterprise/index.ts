import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../../.env') });

const options: MysqlConnectionOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME_ENTERPRISE,
    logging: false,
    synchronize: false,
    entities: [],
    migrations: ['src/migrations/enterprise/scripts/*{.ts,.js}'],
    multipleStatements: true,
};

export default new DataSource(options);
