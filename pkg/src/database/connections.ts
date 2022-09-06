import { DbConnection, DbName } from './config/db';
import { OrmConfig } from './config/ormConfig';

export const DatabaseConnections = [
    OrmConfig(DbConnection.mediaCon, DbName.media),
    OrmConfig(DbConnection.exhibitionCon, DbName.exhibition),
    OrmConfig(DbConnection.enterpriseCon, DbName.enterprise),
];
