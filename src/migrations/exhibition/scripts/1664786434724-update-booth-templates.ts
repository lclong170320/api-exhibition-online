import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
const sqlUp = fs.readFileSync(
    path.join(__dirname, '../sql/update-booth-templates-up.sql'),
    {
        encoding: 'utf-8',
    },
);

const sqlDown = fs.readFileSync(
    path.join(__dirname, '../sql/update-booth-templates-down.sql'),
    {
        encoding: 'utf-8',
    },
);

export class updateBoothTemplates1664786434724 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`${sqlUp}`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`${sqlDown}`);
    }
}
