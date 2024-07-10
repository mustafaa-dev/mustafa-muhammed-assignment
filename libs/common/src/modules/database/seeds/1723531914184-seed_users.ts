import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUsers1723531914184 implements MigrationInterface {
  name = 'SeedUsers1723531914184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    //super@otm.com Pa$$word10
    await queryRunner.query(`
        INSERT INTO "users" ("name", "email", "password", "role_id")
        VALUES ('Mustafa_Super_Admin', 'super@otm.com', '$2a$10$mEw8iPk7WNvtudXPbb0kmubz3XNWN9KSkbTkRGd/USVlofNjXSCdq',
                '1a3f6536-e689-4554-8887-c59872810ffa');
    `);

    await queryRunner.query(`
        INSERT INTO "users" ("name", "email", "password", "role_id")
        VALUES ('Mustafa_Admin', 'admin@otm.com', '$2a$10$mEw8iPk7WNvtudXPbb0kmubz3XNWN9KSkbTkRGd/USVlofNjXSCdq',
                '0ae51466-cbe3-471e-b12b-f2c7100ade93');
    `);

    await queryRunner.query(`
        INSERT INTO "users" ("name", "email", "password", "role_id")
        VALUES ('Mustafa_Leader', 'leader@otm.com', '$2a$10$mEw8iPk7WNvtudXPbb0kmubz3XNWN9KSkbTkRGd/USVlofNjXSCdq',
                '53be17ad-e1b7-4bbb-b74e-6aece2886ba0');
    `);

    await queryRunner.query(`
        INSERT INTO "users" ("name", "email", "password", "role_id")
        VALUES ('Mustafa_User', 'user@otm.com', '$2a$10$mEw8iPk7WNvtudXPbb0kmubz3XNWN9KSkbTkRGd/USVlofNjXSCdq',
                'cb2cbdfb-b6fd-4bed-adb6-9d75f8d64065');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
