import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTaskRelation1720596039089 implements MigrationInterface {
    name = 'UserTaskRelation1720596039089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "owner_id" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_0631c1eb8316f8af361cf14eb85" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_0631c1eb8316f8af361cf14eb85"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "owner_id"`);
    }

}
