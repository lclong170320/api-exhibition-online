import { DataSource } from 'typeorm'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'

const options: MysqlConnectionOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'password',
    database: 'compaon_exhibition_dev',
    logging: false,
    synchronize: false,
    entities: [],
    migrations: ['src/migrations/exhibition/*{.ts,.js}'],
}

export default new DataSource(options)
