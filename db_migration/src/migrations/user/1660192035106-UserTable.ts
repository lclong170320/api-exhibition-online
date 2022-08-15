import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserTable1660192035106 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE user (
              id int NOT NULL AUTO_INCREMENT,
              name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
              created_at date NOT NULL,
              updated_at date NOT NULL,
              PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE user;`)
    }
}
