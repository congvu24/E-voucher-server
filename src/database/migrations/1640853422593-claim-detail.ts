import {MigrationInterface, QueryRunner} from "typeorm";

export class claimDetail1640853422593 implements MigrationInterface {
    name = 'claimDetail1640853422593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucherClaim" ADD "citizen_name" character varying`);
        await queryRunner.query(`ALTER TABLE "voucherClaim" ADD "citizen_email" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucherClaim" DROP COLUMN "citizen_email"`);
        await queryRunner.query(`ALTER TABLE "voucherClaim" DROP COLUMN "citizen_name"`);
    }

}
