import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { AuthService } from "../auth.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService:AuthService,
    configService: ConfigService
    
  ){
    // necesitamos mandar arriba cual es la llave para firmar los tokens
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      // tmb hay que decirle donde viene el token y como 
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }

  // 
  // para que todo funcione hay que implementar el método validate
  async validate(payload: JwtPayload):Promise<User>{
    const {id} = payload;
    // o viene el user o los errores de las delegaciones pararán la promise 
    const user = await this.authService.validateUser( id );
    // con retornarlo me vale, las layers de Nest harán caer la Promise y pasarse el tipo de Error

    // NOTA lo que devuelva en validate lo voy a poder ver como request.lo que retorne aqui
    return user;
    
  }
}