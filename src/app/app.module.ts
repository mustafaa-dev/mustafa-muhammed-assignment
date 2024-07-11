import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users';
import { TasksModule } from '@tasks';
import { validateEnv } from '@app/dtos';
import { ConfigModule } from '@nestjs/config';
import { AppService, LoggerService } from '@app/services';
import { DatabaseModule } from '@app/common';
import { AppController } from '@app/controllers';
import { SwaggerModule } from '@nestjs/swagger';
import { RolesModule } from '../roles';
import { NotificationsModule } from '../notifications';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    AuthModule,
    UsersModule,
    TasksModule,
    DatabaseModule,
    RolesModule,
    SwaggerModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule {}
