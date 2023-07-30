import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs/SignUp.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {
  // fijate que Nest utiliza este tipo de logger ya en la consola
  private logger = new Logger();

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const hashedPassword = bcrypt.hashSync(signupInput.password, 12);

      const newUser = this.usersRepository.create({
        ...signupInput,
        password: hashedPassword,
      });
      //create no lo guarda,eso lo hace el save
      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    // si no vienen roles devolvemos todos los users.Fijate que ahora tengo que decir que se cargen las relaciones
    if (roles.length === 0)
      return await this.usersRepository
        .find
        // ya no es necesario por el lazy a true de la Entidad
        // { relations:{ lastUpdateBy:true } }
        ();
    return (
      this.usersRepository
        .createQueryBuilder('User') // <- es un alias cualquiera
        // realmente nos valia con where() pero asi vemos otra forma
        // ARRAY[name] contains ARRAY[:...parameter] <- porque es un parametro
        .andWhere('ARRAY[roles] && ARRAY[:...roles]')
        .setParameter('roles', roles) // necesario,evita SQL injection
        .getMany()
    );
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      // findOneOrFail si falla entra al catch(y el findOne no??)
      return await this.usersRepository.findOneByOrFail({ email: email });
    } catch (error) {
      this.handleDBErrors({
        code: 'error-404 warro',
        detail: `User with email ${email} not found in the DB`,
      });
    }
  }
  async findOneById(id: string): Promise<User> {
    try {
      // findOneOrFail si falla entra al catch(y el findOne no??)
      return await this.usersRepository.findOneByOrFail({ id: id });
    } catch (error) {
      this.handleDBErrors({
        code: 'error-404 warro',
        detail: `User with id ${id} not found in the DB`,
      });
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    adminUser: User,
  ): Promise<User> {
    try {
      const userToUpdate = await this.usersRepository.preload(updateUserInput);
      userToUpdate.lastUpdateBy = adminUser;
      return await this.usersRepository.save(userToUpdate);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;
    return await this.usersRepository.save(userToBlock);
  }

  // una vez que entre a este método jamás va a regresar un valor (type never)Es decir,esté metodo siempre debe tirar una expection
  private handleDBErrors(error: any): never {
    this.logger.error(error);

    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('key ', ''));
    }

    if (error.code === 'error-404 warro') {
      throw new NotFoundException(error.detail);
    }

    throw new InternalServerErrorException(`Please check server logs`);
  }
}
