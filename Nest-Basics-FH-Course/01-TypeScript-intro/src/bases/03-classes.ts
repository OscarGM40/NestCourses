import axios from "axios";
import { Move, PokeapiResponse } from "../interfaces/pokeapi-response.interface";

export class Pokemon {
  // la forma corta es quitar la declaracion y posterior reasignacion en el constructor por simplemente el modificador de acceso en el constructor
  constructor(
    public readonly id: number,
    public name: string,
    
    ) {
    console.log("construyendo el objeto");
  }

  // getter(se crea con la palabra reservada get)
  get imageUrl():string {
    return `https://pokemon.com/${this.id}` 
  }
  get _name():string {
    return this.name;
  }
  // obviamente puedo crear métodos de instancia
  scream(){
    console.log(`${this.name.toLocaleUpperCase()}!!!`);
    this.speak()
  }
  private speak():void {
    console.log(`${this.name},${this.name}`);
  }

  async getMoves():Promise<Move[]> {
    // imaginate que yo quiero saber esto antes de saltar a la siguiente linea
    // const resp = axios.get(`https://pokeapi.co/api/v2/pokemon/4`) 
    // si lo dejo asi resp es una promesa,pues no esperé
    const resp = await axios.get<PokeapiResponse>(`https://pokeapi.co/api/v2/pokemon/4`); // aqui lo  mismo,si lo dejo asi resp es una promesa
    console.log(resp.data)
    return resp.data.moves;
  }
}

export const charmander = new Pokemon(1, "charmander");
charmander.scream()
charmander.getMoves()