import {MigrationInterface, QueryRunner} from "typeorm";

export class addVoucher1635344583564 implements MigrationInterface {
    name = 'addVoucher1635344583564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."voucher_status_enum" AS ENUM('UNUSE', 'USED', 'CANCEL', 'DELETED')`);
        await queryRunner.query(`CREATE TABLE "voucher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."voucher_status_enum" NOT NULL DEFAULT 'UNUSE', "value" integer, "citizen_id" uuid, "supplier_id" uuid, "dealer_id" uuid, "package_id" uuid, CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "request" ADD "voucher_id" uuid`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "UQ_ba516f117fd8364ee8d6411df6c" UNIQUE ("voucher_id")`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_ecd7a276422330fd516b4a058ae" FOREIGN KEY ("citizen_id") REFERENCES "citizens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_71a8cb29c9b7dd0a921585fb97e" FOREIGN KEY ("supplier_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_0626c24219cc76904c3b555e4a1" FOREIGN KEY ("dealer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_dde4791029b631edc108fca419e" FOREIGN KEY ("package_id") REFERENCES "package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_ba516f117fd8364ee8d6411df6c" FOREIGN KEY ("voucher_id") REFERENCES "voucher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_ba516f117fd8364ee8d6411df6c"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_dde4791029b631edc108fca419e"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_0626c24219cc76904c3b555e4a1"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_71a8cb29c9b7dd0a921585fb97e"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_ecd7a276422330fd516b4a058ae"`);
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "UQ_ba516f117fd8364ee8d6411df6c"`);
        await queryRunner.query(`ALTER TABLE "request" DROP COLUMN "voucher_id"`);
        await queryRunner.query(`DROP TABLE "voucher"`);
        await queryRunner.query(`DROP TYPE "public"."voucher_status_enum"`);
    }

}
