import {MigrationInterface, QueryRunner} from "typeorm";

export class editDb1635565771740 implements MigrationInterface {
    name = 'editDb1635565771740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN', 'GOVERMENT', 'DEALER', 'SUPPLIER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "avatar" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "package" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "min_value" integer, "max_value" integer, "is_show" boolean NOT NULL DEFAULT true, "dealer_id" uuid, CONSTRAINT "PK_308364c66df656295bc4ec467c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."voucher_status_enum" AS ENUM('UNUSE', 'USED', 'CANCEL', 'DELETED')`);
        await queryRunner.query(`CREATE TABLE "voucher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."voucher_status_enum" NOT NULL DEFAULT 'UNUSE', "value" integer, "token" character varying, "citizen_id" uuid, "supplier_id" uuid, "dealer_id" uuid, "package_id" uuid, CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."request_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."request_status_enum" NOT NULL DEFAULT 'PENDING', "note" character varying, "citizen_id" uuid, "voucher_id" uuid, CONSTRAINT "REL_ba516f117fd8364ee8d6411df6" UNIQUE ("voucher_id"), CONSTRAINT "PK_167d324701e6867f189aed52e18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "citizens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "identify" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "address" character varying NOT NULL, "email" character varying NOT NULL, "job" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "avatar" character varying, "is_active" boolean NOT NULL DEFAULT false, "is_valid" boolean NOT NULL DEFAULT false, "role" character varying NOT NULL DEFAULT 'USER', "secret" character varying, CONSTRAINT "UQ_532894cae3f0ba9c7a50ba5bcf8" UNIQUE ("identify"), CONSTRAINT "UQ_f419beb584c5bdd57652049bdad" UNIQUE ("email"), CONSTRAINT "PK_125518d98ee3b4cf52b8ab14a43" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "FK_9bf149080d1a6d301b7abcc09e3" FOREIGN KEY ("dealer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_ecd7a276422330fd516b4a058ae" FOREIGN KEY ("citizen_id") REFERENCES "citizens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_71a8cb29c9b7dd0a921585fb97e" FOREIGN KEY ("supplier_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_0626c24219cc76904c3b555e4a1" FOREIGN KEY ("dealer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_dde4791029b631edc108fca419e" FOREIGN KEY ("package_id") REFERENCES "package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_61bfc4c72df8db2a4fd9839389e" FOREIGN KEY ("citizen_id") REFERENCES "citizens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_ba516f117fd8364ee8d6411df6c" FOREIGN KEY ("voucher_id") REFERENCES "voucher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_ba516f117fd8364ee8d6411df6c"`);
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_61bfc4c72df8db2a4fd9839389e"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_dde4791029b631edc108fca419e"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_0626c24219cc76904c3b555e4a1"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_71a8cb29c9b7dd0a921585fb97e"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_ecd7a276422330fd516b4a058ae"`);
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "FK_9bf149080d1a6d301b7abcc09e3"`);
        await queryRunner.query(`DROP TABLE "citizens"`);
        await queryRunner.query(`DROP TABLE "request"`);
        await queryRunner.query(`DROP TYPE "public"."request_status_enum"`);
        await queryRunner.query(`DROP TABLE "voucher"`);
        await queryRunner.query(`DROP TYPE "public"."voucher_status_enum"`);
        await queryRunner.query(`DROP TABLE "package"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
