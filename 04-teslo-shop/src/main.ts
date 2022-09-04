import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 3000;
const logger = new Logger('Bootstrap');

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
// configuración para el SwaggerModule
  const config = new DocumentBuilder()
    .setTitle('Teslo RESTful API')
    .setDescription('Teslo shop endpoints')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // va a crear en el segmento 'api' todo.Si quiero cambiarlo a por ejemplo doc deberia ser SwaggerModule.setup('doc')
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    console.clear();
    logger.log('Nest running on port ' + PORT);
  });
}
bootstrap();
