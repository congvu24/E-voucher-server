import {MigrationInterface, QueryRunner} from "typeorm";

export class updateClaimRecord1637595220106 implements MigrationInterface {
    name = 'updateClaimRecord1637595220106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "voucherClaim" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "voucher_id" character varying NOT NULL, "service_package_id" uuid, CONSTRAINT "UQ_3f44f721df495ea5956e171e3c5" UNIQUE ("voucher_id"), CONSTRAINT "PK_ebd99375287c41c2897ac606ee5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "voucherClaim" ADD CONSTRAINT "FK_259d99b655e16501337856dbf88" FOREIGN KEY ("service_package_id") REFERENCES "package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucherClaim" DROP CONSTRAINT "FK_259d99b655e16501337856dbf88"`);
        await queryRunner.query(`DROP TABLE "voucherClaim"`);
    }

}
