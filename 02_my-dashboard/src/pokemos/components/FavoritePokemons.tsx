'use client'

import { useAppSelector } from "@/store";
import { PokemonGrid } from "./PokemonGrid";


export const FavoritePokemons = () => {

    const favoritos = useAppSelector((state) => Object.values(state.pokemonsReducer));
  
    console.log({favoritos})


    return (
        <PokemonGrid pokemos={favoritos} />
    )
}
