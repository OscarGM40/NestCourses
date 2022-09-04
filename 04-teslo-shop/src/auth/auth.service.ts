import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDTO) {
    try {
      const user = this.userRepository.create({
        ...createUserDto,
        password: bcrypt.hashSync(createUserDto.password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDTO) {
    const { email, password } = loginUserDto;

    try {
      // puedo usar select en la Entity tmb
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true },
      });

      if (!user) {
        throw new UnauthorizedException('Credentials are not valid(email');
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Credentials are not valid(password)');
      }

      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async checkAuthStatus(user: User) {
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(`${error.detail}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Please check server logs`);
  }
}
