import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1720535914184 implements MigrationInterface {
  name = 'SeedRoles1720535914184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "roles" ("name")
        VALUES ('super_admin'),
               ('admin'),
               ('leader'),
               ('user');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE
        FROM "permissions"
        WHERE "name" IN ('super_admin', 'admin', 'leader', 'user');
    `);
  }
}
