import {MigrationInterface, QueryRunner} from "typeorm";

export class addPackage1635262603329 implements MigrationInterface {
    name = 'addPackage1635262603329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package" ALTER COLUMN "min_value" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package" ALTER COLUMN "max_value" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" ALTER COLUMN "max_value" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package" ALTER COLUMN "min_value" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package" ALTER COLUMN "description" SET NOT NULL`);
    }

}
