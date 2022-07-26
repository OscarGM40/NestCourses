export const pokemonIds = []

interface Pokemon {
  id: number;
  name: string;
  age: number | undefined; // si quiero que una prop sea opcional debo usar ?
}

export const bulbasaur:Pokemon = {
  id: 1,
  name: 'bulbasaur',
}
 
pokemonIds.push(+'1','2',bulbasaur)

export const pokemons: Pokemon = [];