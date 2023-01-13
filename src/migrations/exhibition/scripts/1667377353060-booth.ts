import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
const sqlUp = fs.readFileSync(
    path.join(__dirname, '../sql/1667377353060-booth-up.sql'),
    {
        encoding: 'utf-8',
    },
);
const sqlDown = fs.readFileSync(
    path.join(__dirname, '../sql/1667377353060-booth-down.sql'),
    {
        encoding: 'utf-8',
    },
);

export class Booth1667377353060 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`${sqlUp}`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`${sqlDown}`);
    }
}
