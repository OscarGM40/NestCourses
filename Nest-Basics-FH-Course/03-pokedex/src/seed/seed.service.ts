import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly pokemonService: PokemonService,
    private readonly axiosAdapter: AxiosAdapter,
  ) {}

  async executeSeed() {
    const data = await this.axiosAdapter.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    await this.pokemonService.removeAll();

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      // forma uno
      // insertPromisesArray.push(this.pokemonService.create({name,no}))
      // await Promise.all(insertPromisesArray)

      // forma dos
      pokemonToInsert.push({ name, no });
      // await this.pokemonService.create({ name, no });
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return data;
  }
}
