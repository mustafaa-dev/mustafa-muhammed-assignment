import { ValidationError } from '@nestjs/common';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
  validateSync,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class EnvDto {
  @IsString()
  @IsNotEmpty()
  APP_NAME: string;

  @IsString()
  @IsNotEmpty()
  NODE_ENV: string;

  @IsString()
  @IsNotEmpty()
  DEV_APP_CONSOLE_DEBUGGING: string;

  @IsString()
  @IsNotEmpty()
  DEV_APP_FILE_DEBUGGING: string;

  @IsString()
  @IsNotEmpty()
  PROD_APP_CONSOLE_DEBUGGING: string;

  @IsString()
  @IsNotEmpty()
  PROD_APP_FILE_DEBUGGING: string;

  @IsString()
  @IsNotEmpty()
  TELEGRAM_LOGGING: string;

  @ValidateIf((c) => c.TELEGRAM_LOGGING === 'true')
  @IsString()
  @IsNotEmpty()
  TELEGRAM_BOT_TOKEN: string;

  @ValidateIf((o) => o.TELEGRAM_LOGGING === 'true')
  @IsNumber()
  @IsNotEmpty()
  TELEGRAM_CHAT_ID: number;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;

  @IsBoolean()
  @IsNotEmpty()
  DB_SYNCHRONIZE: boolean;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRATION_TIME: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const configs = plainToInstance(EnvDto, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(configs, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(
      errors
        .map((error: ValidationError) => error.property.toString())
        .join(', '),
    );
  }
  return configs;
}
