import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Like, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    // si bien pudiera parecer que puedo hacer createItemInput.user = user no se recomienda que mute la entrada,asi que lo mejor es el approach de abajo ↓↓
    const newItem = this.itemsRepository.create({
      ...createItemInput,
      user: user,
    });
    return await this.itemsRepository.save(newItem);
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Item[]> {
    // fijate que estas dos propiedades siempre van a tner un valor
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    console.log({search})
    // rye bread= pan de centeno
/*     return await this.itemsRepository.find({
      relations: ['user'],
      where: {
        user: {
          id: user.id,
        },
        name: Like(`%${search}%`) 
      },
      skip: offset,
      take: limit,
    }); */

    const queryBuilder = this.itemsRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      // ojo que el campo es item.user.id
      .where(`"userId" = :userId`, {userId: user.id})
      // .setParameter('userId',user.id) <- otra forma
      if(search){
        queryBuilder.andWhere('LOWER(name) like :name',{name:`%${search.toLowerCase()}%`})
      }
      return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOne({
      relations: ['user'],
      where: {
        id: id,
        user: {
          id: user.id,
        },
      },
    });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    const item = await this.findOne(id, user);
    if (updateItemInput.name) item.name = updateItemInput.name;
    if (updateItemInput.quantityUnits)
      item.quantityUnits = updateItemInput.quantityUnits;
    return await this.itemsRepository.save(item);

    // preload(entity) crea una Entity pero si ya existiera en la DB lo que hace es actualizar esa ya existente(es un upsert vamos).Necesita del save tmb.Esta forma ya no vale en cuanto hemos necesitado el usuario tmb
    // const item = await this.itemsRepository.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    // return this.itemsRepository.save(updateItemInput);
  }

  async remove(id: string, user: User): Promise<Item> {
    // TODO soft delete, integridad referencial
    const item = await this.findOne(id, user);
    console.log({ itemRetrieved: item });
    // porqué remove antes que delete
    await this.itemsRepository.remove(item);
    // por alguna razon el id es undefined tras el remove asi que usamos el argumento
    return { ...item, id };
  }

  // esta funcion se llama simplemente con process() asinto,me cago en tuputa madre. Si ésta fuera parte de otra esa otra funcion si que tiene que ser async por tener un proceso asincrono dentro.No es lo mismo embeber un proceso asincrono que llamarla
  async process() {
    return await this.itemsRepository.find();
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemsRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
