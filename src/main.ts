import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PORT ?? 5001;
  const FRONTEND_URL = process.env.FRONTEND_URL;
  console.log(PORT);
  console.log(FRONTEND_URL);

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: FRONTEND_URL,
    credentials: true,
  });

  await app.listen(PORT);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    }))
};
bootstrap();