import { LogLevel, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
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

  const configService = app.get(ConfigService);
  const frontendUrl = configService.get('FRONTEND_URL');
  if (frontendUrl) app.enableCors({ origin: frontendUrl, credentials: true });

  await app.listen(3000);
}
bootstrap();
