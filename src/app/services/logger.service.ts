import { Injectable } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import * as TelegramLogger from 'winston-telegram';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';
import { utilities } from 'nest-winston';

@Injectable()
export class LoggerService {
  readonly logger;
  readonly options: any;

  constructor(private readonly configService: ConfigService) {
    this.options = {
      console: {
        level: 'silly',
        format: format.combine(
          format.timestamp(),
          format.errors({ stack: true }),
          format.ms(),
          utilities.format.nestLike(process.env.APP_NAME, {
            colors: true,
            prettyPrint: true,
          }),
        ),
      },
      telegram: {
        token: this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'),
        chatId: this.configService.getOrThrow<number>('TELEGRAM_CHAT_ID'),
        formatMessage(params: any, info: any): string {
          return `${configService.getOrThrow<string>(
            'APP_NAME',
          )} | ${new Date().toUTCString()} | [${params.level.toUpperCase()}] | ${
            info.context
          } : ${info.args.args} | ${params.message}`;
        },
      },
    };

    const transportsList = this.getTransporters();

    const loggerOptions = {
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
      ),
      transports: transportsList,
    };

    this.logger = createLogger(loggerOptions);
  }

  createFile(level: string) {
    return {
      filename: `logs/${process.env.APP_NAME}-${
        process.env.NODE_ENV
      }-${level.toUpperCase()}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level,
    };
  }

  getTransporters() {
    const t: any = [];
    const env = process.env.NODE_ENV === 'PRODUCTION' ? 'PROD' : 'DEV';
    if (
      this.configService.getOrThrow<string>(`${env}_APP_CONSOLE_DEBUGGING`) ===
      'true'
    )
      t.push(new transports.Console(this.options.console));
    if (this.configService.getOrThrow<string>('TELEGRAM_LOGGING') === 'true')
      t.push(new TelegramLogger(this.options.telegram));
    if (
      this.configService.getOrThrow<string>(`${env}_APP_FILE_DEBUGGING`) ===
      'true'
    ) {
      t.push(new transports.DailyRotateFile(this.createFile('debug')));
      t.push(new transports.DailyRotateFile(this.createFile('error')));
    }
    return t;
  }

  error(trace: any, options: any) {
    this.logger.error(trace, options);
  }

  warn(message: string, options: any) {
    this.logger.warn(message, options);
  }

  info(message: string, options: any) {
    this.logger.info(message, options);
  }

  debug(message: string, options: any) {
    this.logger.debug(message, options);
  }
}
