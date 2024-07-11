import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUsers1723531914184 implements MigrationInterface {
  name = 'SeedUsers1723531914184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    //super@otm.com StrongPassword1020!@#
    const superAdminRole = await queryRunner.query(`
        SELECT "id"
        FROM "roles"
        WHERE "name" = 'super_admin';
    `);
    const adminRole = await queryRunner.query(`
        SELECT "id"
        FROM "roles"
        WHERE "name" = 'admin';
    `);
    const leaderRole = await queryRunner.query(`
        SELECT "id"
        FROM "roles"
        WHERE "name" = 'leader';
    `);
    const userRole = await queryRunner.query(`
        SELECT "id"
        FROM "roles"
        WHERE "name" = 'user';
    `);
    const superAdminRoleId = superAdminRole[0].id;
    const adminRoleId = adminRole[0].id;
    const leaderRoleId = leaderRole[0].id;
    const userRoleId = userRole[0].id;
    await queryRunner.query(`
        INSERT INTO "users" ("name", "email", "password", "role_id")
        VALUES ('Mustafa_Super_Admin', 'super@otm.com', '$2a$10$inP.0cbn5HptJCahz2W2Kulc0o.Fz9IBTkmJFu3j4HL8THZlR4zKW',
                '${superAdminRoleId}');
    `);

    await queryRunner.query(`
        INSERT INTO "users" ("name", "email", "password", "role_id")
        VALUES ('Mustafa_Admin', 'admin@otm.com', '$2a$10$inP.0cbn5HptJCahz2W2Kulc0o.Fz9IBTkmJFu3j4HL8THZlR4zKW',
                '${adminRoleId}');
    `);

    await queryRunner.query(`
        INSERT INTO "users" ("name", "email", "password", "role_id")
        VALUES ('Mustafa_Leader', 'leader@otm.com', '$2a$10$inP.0cbn5HptJCahz2W2Kulc0o.Fz9IBTkmJFu3j4HL8THZlR4zKW',
                '${leaderRoleId}');
    `);

    await queryRunner.query(`
        INSERT INTO "users" ("name", "email", "password", "role_id")
        VALUES ('Mustafa_User', 'user@otm.com', '$2a$10$inP.0cbn5HptJCahz2W2Kulc0o.Fz9IBTkmJFu3j4HL8THZlR4zKW',
                '${userRoleId}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
