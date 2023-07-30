import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // ConfigModule no necesita más y es el que lee las env,como este modulo va a necesitar esto lo importamos
    ConfigModule,
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    // este modulo JwtModule depende de que ConfigModule haya leido las env luego lo cargamos asincronamente
    JwtModule.registerAsync({
      imports: [ConfigModule],
      // servicio inyectable para acceder a envs que debemos declarar
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '4h',
          },
        };
      },
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
