import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly itemsService: ItemsService,
    private readonly configService: ConfigService,
  ) {
    // isProd va a ser true solo en producción
    this.isProd = this.configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException(
        'We cannot run these kind of operations in production,asinto',
      );
    }
    // 1- limpiar la base de datos(borrar todo)
    await this.truncateDatabase();

    // 2- Crear usuarios desde el mock
    await this.loadUsers();

    // 3- Crear items
    await this.loadItems();
    return true;
  }

  async truncateDatabase() {
    // borrar items
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    // borrar users
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User[]> {
    const users = [];
    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }
    return users;
  }

  async loadItems(): Promise<void> {
    const users = await this.usersRepository.find({});

    for (const item of SEED_ITEMS) {
      const randomIndex = Math.floor(Math.random() * users.length);
      await this.itemsService.create(item, users[randomIndex]);
    }
  }
}
