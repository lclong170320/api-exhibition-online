import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

const sqlUp = fs.readFileSync(
    path.join(
        __dirname,
        '../sql/update-exhibitions-deleteColumDescription-updateForeignKey-up.sql',
    ),
    {
        encoding: 'utf-8',
    },
);

const sqlDown = fs.readFileSync(
    path.join(
        __dirname,
        '../sql/update-exhibitions-deleteColumDescription-updateForeignKey-down.sql',
    ),
    {
        encoding: 'utf-8',
    },
);

export class updateExhibitionsDeleteDescription1666063685142
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`${sqlUp}`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`${sqlDown}`);
    }
}