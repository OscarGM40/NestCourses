import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignupInput } from './dto/inputs/SignUp.input';
import { AuthResponse } from './types/auth-response.type';
import { LoginInput } from './dto/inputs/Login.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(id: string): string {
    return this.jwtService.sign({ id });
  }

  // TIP :es el servicio de los usuarios el que debe crear el User
  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    // STEP UNO crear un User mediante inyección del otro service
    const user = await this.usersService.create(signupInput);

    // STEP DOS crear un token con la inyeccion de instancia de JwtService(libreria/implementación externa al core)
    const token = this.getJwtToken(user.id);
    return {
      token,
      user,
    };
  }

  async login({ email, password }: LoginInput): Promise<AuthResponse> {
    // de nuevo debe ser el otro modulo el que interactue con la DB
    const user = await this.usersService.findOneByEmail(email);
    // si llega aqui tenemos un user con acceso a su pass
    const passwordsMatch = bcrypt.compareSync(password, user.password);

    if (!passwordsMatch) {
      throw new BadRequestException(`Wrong credentials(password)`);
    }

    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }
  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }
  async validateUser(id: string): Promise<User> {
    // buscamos el user
    const user = await this.usersService.findOneById(id);
    //  si está inactivo lanzamos un error
    if (!user.isActive) throw new UnauthorizedException(`User is inactive`);

    // borramos la password ya que también la trajimos de la DB
    delete user.password;
    return user;
  }
}
