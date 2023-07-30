import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    /*     GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      // process.cwd es la carpeta donde se está ejecutando el proyecto
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // este plugin es para levantar el Apollo Studio
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }), */
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      // fijate que puedo importar en esta carga asincrona lo que quiera,obviamente vamos a necesitar el AuthModule
      imports: [AuthModule],
      // pero fijate que incluso puedo inyectar servicios,y de nuevo necesitamos el JwtService(para comprobar si el token es válido)
      //ojo,inyectarlo no lo instancia,esto es tarea del useFactory
      inject: [JwtService],
      // mediante este useFactory: async() =>  vamos a construir lo que necesitemos y despues retornarlo.Obviamente tengo que retornar lo mismo,quitando el driver que me subió un nivel,y ojo,que añadimos el context
      useFactory: async (jwtService: JwtService) => {
        return {
          playground: false,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          context({ req }) {
            const token = req.headers.authorization?.replace('Bearer ', '');
            const payload = jwtService.decode(token)
            // en este punto si alguien abre el Apollo Studio y no hay token podriamos monitorizar todo esto por seguridad,etc o avisar como quisieramos
         /*    if(!token) throw new Error('Token needed')
            if(!payload) throw new Error('Token not valid') */
          },
        };
      },
    }),
    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl:
          process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
