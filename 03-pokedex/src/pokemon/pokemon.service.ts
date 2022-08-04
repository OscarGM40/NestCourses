import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(offset: number = 0, limit: number = 10) {
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({no:1})
      .select('-__v');
  }

  async findOne(param: string) {
    let pokemon: Pokemon;
    //si el param  es un no
    if (!isNaN(+param)) {
      // ojo que moongose va a convertir param a number,no hace falta hacerlo
      pokemon = await this.pokemonModel.findOne({ no: param });
    }
    //si el param  es un mongoId
    if (!pokemon && isValidObjectId(param)) {
      pokemon = await this.pokemonModel.findById(param);
    }
    //si aun no encontramos nada miramos por name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: param });
    }
    // si no hemos encontrado nada lanzamos un 404
    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id,name or no ${param} not found`,
      );
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    // fijate la importancia de llamar en el update al getOne,esto es un estandar y una buena practica
    const pokemon = await this.findOne(term);
    // si llegamos aqui es que he encontrado un pokemon
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try {
      await this.pokemonModel.findOneAndUpdate(
        { _id: pokemon._id },
        updatePokemonDto,
      );
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    /*  Queremos evitar dos consultas a la db   
    const pokemon = await this.findOne(id);
    await this.pokemonModel.deleteOne(); */

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }
    return;
  }
  async removeAll() {
    const { deletedCount } = await this.pokemonModel.deleteMany({});
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemons already deleted`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon already exists on DB ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't update Pokemon - Check server logs`,
    );
  }
}
