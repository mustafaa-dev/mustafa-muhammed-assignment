import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRolesPermissions1723538914184 implements MigrationInterface {
  name = 'SeedRolesPermissions1723538914184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "role_permissions" ("role_id", "permission_id")
        SELECT r.id, p.id
        FROM "roles" r,
             "permissions" p
        WHERE r.name = 'admin'
          AND p.name IN
              ('CREATE:ALL', 'READ:ALL', 'UPDATE:ALL', 'DELETE:ALL', 'CREATE:GROUP', 'READ:GROUP', 'UPDATE:GROUP',
               'READ:SETTINGS', 'UPDATE:SETTINGS', 'READ:SELF', 'UPDATE:SELF', 'CREATE:TASKS', 'READ:TASKS',
               'UPDATE:TASKS', 'DELETE:TASKS', 'CREATE:USERS', 'READ:USERS', 'UPDATE:USERS', 'DELETE:USERS');
    `);

    await queryRunner.query(`
        INSERT INTO "role_permissions" ("role_id", "permission_id")
        SELECT r.id, p.id
        FROM "roles" r,
             "permissions" p
        WHERE r.name = 'leader'
          AND p.name IN ('CREATE:GROUP', 'READ:GROUP', 'UPDATE:GROUP', 'READ:SETTINGS', 'READ:SELF', 'UPDATE:SELF',
                         'CREATE:TASKS', 'READ:TASKS', 'UPDATE:TASKS');
    `);

    await queryRunner.query(`
        INSERT INTO "role_permissions" ("role_id", "permission_id")
        SELECT r.id, p.id
        FROM "roles" r,
             "permissions" p
        WHERE r.name = 'user'
          AND p.name IN ('READ:SELF', 'UPDATE:SELF', 'READ:TASKS', 'UPDATE:TASKS');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE
        rp FROM "role_permissions" rp
      JOIN "roles" r ON rp."role_id" = r.id
      WHERE r.name IN ('admin', 'leader', 'user');
    `);
  }
}
