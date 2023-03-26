import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { initialData } from './data/seed-data';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    // primero debo cargar los users por la integridad referencial
    const adminUser = await this.insertUsers()
    await this.insertNewProducts(adminUser);
    return 'INITIAL SEED DATA LOADED';
  }

  private async deleteTables() {
    // los productos mantienen la integridad referencial con el usuario,ya que si un usuario tiene productos no puede borrarse,tengo que borrar todos los productos primero entonces
    await this.productsService.deleteAllProducts();
    // ahora ya puedo eliminar los users
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute(); // destrucción!!
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      user.password = bcrypt.hashSync(user.password,10)
      users.push(this.userRepository.create(user));
    });
    const dbUsers = await this.userRepository.save(users);
    console.log(dbUsers[0].roles)
    return dbUsers[0];
  }

  private async insertNewProducts(user:User) {
    this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(
        this.productsService.create(product, user),
      );
    });

    await Promise.all(insertPromises);

    return true;
  }
}
