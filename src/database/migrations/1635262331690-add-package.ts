import {MigrationInterface, QueryRunner} from "typeorm";

export class addPackage1635262331690 implements MigrationInterface {
    name = 'addPackage1635262331690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "package" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "min_value" integer NOT NULL, "max_value" integer NOT NULL, "is_show" boolean NOT NULL DEFAULT true, "dealer_id" uuid, CONSTRAINT "PK_308364c66df656295bc4ec467c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "FK_9bf149080d1a6d301b7abcc09e3" FOREIGN KEY ("dealer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "FK_9bf149080d1a6d301b7abcc09e3"`);
        await queryRunner.query(`DROP TABLE "package"`);
    }

}
