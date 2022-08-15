import { DbConnection, DbName } from './config/db';
import { OrmConfig } from './config/ormConfig';

export const DatabaseConnections = [
    OrmConfig(DbConnection.exhibitionCon, DbName.exhibition),
];
