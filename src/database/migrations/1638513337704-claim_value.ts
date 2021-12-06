import {MigrationInterface, QueryRunner} from "typeorm";

export class claimValue1638513337704 implements MigrationInterface {
    name = 'claimValue1638513337704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucherClaim" ADD "value" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucherClaim" DROP COLUMN "value"`);
    }

}
