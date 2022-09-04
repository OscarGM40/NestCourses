import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common';

// PassportStrategy(Strategy) es funcion(clase)
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService
  ){
// hay que llamar a la superclase con esto
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });

  }
  
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    // si tiene un email valido en nuestra DB existe el user
    const user = await this.userRepository.findOneBy({id});
    if(!user) throw new UnauthorizedException('Token not valid')
    // si si existe miramos que esté activo
    if(!user.isActive) throw new UnauthorizedException('User is inactive.Talk to an admin')

    // lo que sea que retorne aqui se va a añadir a la request(esto lo hace Nest,es como si en Express hiciera req.user = user)
    return user;
  }
  
}
