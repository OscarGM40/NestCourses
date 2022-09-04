import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    
    try {
      const { images = [], ...productDetails } = createProductDto;

      if (!createProductDto.slug) {
        createProductDto.slug = createProductDto.title
          .toLowerCase()
          .replaceAll(' ', '_')
          .replaceAll("'", '');
      }
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
        user
      });

      await this.productRepository.save(product);
      return { ...product, images: images };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(pDto: PaginationDto) {
    const { limit = 10, offset = 0 } = pDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });

    return products.map((product) => ({
      ...product,
      images: product.images.map((img) => img.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // esta instancia de tipo QueryBuilder tiene acceso a todo,a la cadena de conexión,a las relaciones,...
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }
    if (!product) {
      throw new NotFoundException(`Product with term ${term} not found`);
    }
    return product;
  }

  async findOnePlain(term: string) {
    // estoy llamando al findOne,para poder devolver las imagenes tmb
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((i) => i.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    // preload que hace ??
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id: id,
      ...toUpdate,
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, {
          // ojo que la columna se llama product en la clase ProductImage
          product: { id: id },
        });
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }
      product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      // release libera la conexión,ojo
      await queryRunner.release();
      // await this.productRepository.save(product);
      return this.findOnePlain(id);
    } catch (error) {
      // si hubiera un error hago rollback y suelto la conexión
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    const deleteProduct = await this.productRepository.delete({ id: id });
    if (deleteProduct.affected === 0) {
      throw new NotFoundException(
        `Product with id ${id} for deleting op not found`,
      );
    }
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleExceptions(error);
    }
  }
}
