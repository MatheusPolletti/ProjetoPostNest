import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 5001;
  await app.listen(PORT);
  console.log(PORT)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    }))
};
bootstrap();