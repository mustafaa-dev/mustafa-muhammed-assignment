import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const getDataSourceOptions = (configService: ConfigService): any => ({
  host: configService.getOrThrow<string>('DB_HOST'),
  type: 'postgres',
  port: configService.getOrThrow<number>('DB_PORT'),
  username: configService.getOrThrow<string>('DB_USERNAME'),
  password: configService.getOrThrow<string>('DB_PASSWORD'),
  database: configService.getOrThrow<string>('DB_NAME'),
  synchronize: configService.getOrThrow<boolean>('DB_SYNCHRONIZE'),
  migrations: ['./dist/libs/common/src/modules/database/migrations/*{.ts,.js}'],
  entities: ['./dist/**/*.entity{.ts,.js}'],
});

console.log(__dirname);

export const dataSource = new DataSource(getDataSourceOptions(configService));
