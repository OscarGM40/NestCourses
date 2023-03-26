import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true, //filtra las propiedades
      forbidNonWhitelisted:true //lanza 400 si vienen de más
    })
  )
  await app.listen(3000);
}
bootstrap();
