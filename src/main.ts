import { LogLevel, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './utils/interceptors/logger.interceptor';
import { TransformInterceptor } from './utils/interceptors/transform.interceptor';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const logLevels: LogLevel[] = isProduction
    ? ['error', 'warn', 'log']
    : ['error', 'warn', 'log', 'verbose', 'debug'];

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalInterceptors(
    new LoggerInterceptor(),
    new TransformInterceptor(),
  );

  app.enableVersioning({ type: VersioningType.URI });

  app.enableCors();

  const documentConfig = new DocumentBuilder()
    .setTitle('Masakin API')
    .setDescription('The API for Masakin: Your Modern Recipes Repository')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
