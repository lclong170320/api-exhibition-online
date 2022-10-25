import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

const sqlUp = fs.readFileSync(
    path.join(
        __dirname,
        '../sql/update-foreign-key-table-booth-organization-up.sql',
    ),
    {
        encoding: 'utf-8',
    },
);

const sqlDown = fs.readFileSync(
    path.join(
        __dirname,
        '../sql/update-foreign-key-table-booth-organization-down.sql',
    ),
    {
        encoding: 'utf-8',
    },
);

export class updateForeignKeyTableBoothOrganization1666668081543
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`${sqlUp}`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`${sqlDown}`);
    }
}
