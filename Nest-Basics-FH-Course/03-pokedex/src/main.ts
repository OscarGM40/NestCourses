import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //filtra las propiedades
      forbidNonWhitelisted: true, //lanza 400 si vienen de más
      transform: true, // permitir que los dtos transformen la data
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  await app.listen(process.env.PORT, () => {
    console.clear();
    console.log('listening on port ' + process.env.PORT);
  });
}
bootstrap();
