import {MigrationInterface, QueryRunner} from "typeorm";

export class activateCode1641378124969 implements MigrationInterface {
    name = 'activateCode1641378124969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "citizens" ADD "activate_code" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "citizens" DROP COLUMN "activate_code"`);
    }

}
