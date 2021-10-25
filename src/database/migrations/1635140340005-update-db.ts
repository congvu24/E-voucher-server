import {MigrationInterface, QueryRunner} from "typeorm";

export class updateDb1635140340005 implements MigrationInterface {
    name = 'updateDb1635140340005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "citizens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "identify" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "address" character varying NOT NULL, "email" character varying NOT NULL, "job" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "avatar" character varying, "is_active" boolean NOT NULL DEFAULT false, "is_valid" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_532894cae3f0ba9c7a50ba5bcf8" UNIQUE ("identify"), CONSTRAINT "UQ_f419beb584c5bdd57652049bdad" UNIQUE ("email"), CONSTRAINT "PK_125518d98ee3b4cf52b8ab14a43" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "citizens"`);
    }

}
