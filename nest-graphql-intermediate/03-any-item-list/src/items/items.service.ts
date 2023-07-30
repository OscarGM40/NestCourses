import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemsRepository.create(createItemInput);
    return await this.itemsRepository.save(newItem);
  }

  async findAll(): Promise<Item[]> {
    // TODO filtrar, paginar, buscar por usuario,...
    return await this.itemsRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.findOne(id);
    if (updateItemInput.name) item.name = updateItemInput.name;
    if (updateItemInput.quantity) item.quantity = updateItemInput.quantity;
    if (updateItemInput.measureUnit)
      item.measureUnit = updateItemInput.measureUnit;
    return await this.itemsRepository.save(item);

    // preload(entity) crea una Entity pero si ya existiera en la DB lo que hace es actualizar esa ya existente(es un upsert vamos).Necesita del save tmb
    // const item = await this.itemsRepository.preload(updateItemInput);
      if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    // return this.itemsRepository.save(updateItemInput);
  }

  async remove(id: string):Promise<Item> {
    // TODO soft delete, integridad referencial
    const item = await this.findOne(id);
    console.log({itemRetrieved:item})
    // porqué remove antes que delete
    await this.itemsRepository.remove(item);
    // por alguna razon el id es undefined tras el remove asi que usamos el argumento
    return {...item,id};
  }

  // esta funcion se llama simplemente con process() asinto,me cago en tuputa madre. Si fuera parte de otra esa otra funcion si que tiene que ser async por tener un proceso asincrono dentro
  async process() {
    return await this.itemsRepository.find();
  }
}
