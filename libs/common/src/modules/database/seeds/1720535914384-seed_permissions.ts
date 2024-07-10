import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPermissions1720535914384 implements MigrationInterface {
  name = 'SeedPermissions1720535914384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "permissions" ("name")
        VALUES ('CREATE:ALL'),
               ('READ:ALL'),
               ('UPDATE:ALL'),
               ('DELETE:ALL'),
               ('CREATE:GROUP'),
               ('READ:GROUP'),
               ('UPDATE:GROUP'),
               ('READ:SETTINGS'),
               ('UPDATE:SETTINGS'),
               ('READ:SELF'),
               ('UPDATE:SELF');
    `);
    await queryRunner.query(`
        INSERT INTO "permissions" ("name")
        VALUES ('CREATE:TASKS'),
               ('READ:TASKS'),
               ('UPDATE:TASKS'),
               ('DELETE:TASKS');
    `);
    await queryRunner.query(`
        INSERT INTO "permissions" ("name")
        VALUES ('CREATE:USERS'),
               ('READ:USERS'),
               ('UPDATE:USERS'),
               ('DELETE:USERS');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE
        FROM "permissions"
        WHERE "name" IN ('CREATE:ALL', 'READ:ALL', 'UPDATE:ALL', 'DELETE:ALL');
    `);
    await queryRunner.query(`
        DELETE
        FROM "permissions"
        WHERE "name" IN ('CREATE:GROUP', 'READ:GROUP', 'UPDATE:GROUP', 'READ:SETTINGS');
    `);
    await queryRunner.query(`
        DELETE
        FROM "permissions"
        WHERE "name" IN ('READ:SELF', 'UPDATE:SELF');
    `);
  }
}
