import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@app/services';
import { ApiErrorFilter, LoggingInterceptor } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const loggerService = app.get(LoggerService);
    const configService = app.get(ConfigService);
    const logger = loggerService.logger;

    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new LoggingInterceptor(loggerService));
    app.useGlobalFilters(new ApiErrorFilter(loggerService));
    app.useGlobalPipes(new ValidationPipe());
    // app.enableCors();
    // app.use(helmet());
    // app.use(
    //   csp({
    //     directives: {
    //       defaultSrc: ["'self'"],
    //       scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    //     },
    //   }),
    // );

    const swaggerConfig = new DocumentBuilder()
      .setTitle('Online Tasks API')
      .setVersion('1.0')
      .setDescription('Swagger API documentation for Online Tasks API.')
      .addBearerAuth(
        {
          description: `Please enter token in following format: JWT`,
          name: 'Authorization',
          bearerFormat: 'Bearer',
          type: 'http',
          in: 'Header',
        },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);

    const port = configService.get('APP_PORT') || 3000;
    await app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`Swagger is available on http://localhost:${port}/api-docs`);
    });

    app.useLogger(
      WinstonModule.createLogger({
        instance: logger,
      }),
    );
  } catch (error) {
    console.error('Error during app initialization', error);
  }
}

bootstrap();
