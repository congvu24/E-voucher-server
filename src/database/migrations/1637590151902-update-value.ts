import {MigrationInterface, QueryRunner} from "typeorm";

export class updateValue1637590151902 implements MigrationInterface {
    name = 'updateValue1637590151902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."voucher_type_enum" AS ENUM('SUPPORT', 'HELP', 'URGENT')`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD "type" "public"."voucher_type_enum" NOT NULL DEFAULT 'SUPPORT'`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD "valid_date" TIMESTAMP`);
        await queryRunner.query(`CREATE TYPE "public"."request_type_enum" AS ENUM('SUPPORT', 'HELP', 'URGENT')`);
        await queryRunner.query(`ALTER TABLE "request" ADD "type" "public"."request_type_enum" NOT NULL DEFAULT 'SUPPORT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."request_type_enum"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP COLUMN "valid_date"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."voucher_type_enum"`);
    }

}
