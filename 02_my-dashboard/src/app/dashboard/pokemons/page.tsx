import { PokemonGrid, PokemosResponse, SimplePokemon } from "@/pokemos";
import { Metadata } from "next";




const getPokemons = async(limit=20, offset=0):Promise<SimplePokemon[]> => {
    const data:PokemosResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    .then(res => res.json());

    const pokemons = data.results.map(pokemon => ({
      id: pokemon.url.split('/').at(-2)!,
      name: pokemon.name
    }))

   // throw new Error(`Esto es una simulacion de un error`)

    return pokemons;
}

export const metadata: Metadata = {
  title: 'Pokemons',
  description: 'description SEO title'
}

export default async function PokemonsPage() {

  const pokemons:SimplePokemon[] = await getPokemons(151);
  // console.log({pokemons})
  return (
    <div className="flex flex-col">
      <span className="text-5xl my-2">Listado de pokemos <small>estaticos</small></span>
      <PokemonGrid pokemos={pokemons}/>
    </div>
  );
}