'use client'

import { useAppSelector } from "@/store";
import { PokemonGrid } from "./PokemonGrid";
import { useState } from "react";
import { IoHeartOutline } from "react-icons/io5";



export const FavoritePokemons = () => {

    const favoritos = useAppSelector((state) => Object.values(state.pokemonsReducer));
    const [pokemons, setPokemons] = useState(favoritos);
    console.log({favoritos})


    return (
        <>
            {
                favoritos.length 
                ?   (<PokemonGrid pokemos={pokemons} />)
                :   (<NoFavorites />)
            }
        </>
        
    )
}

export const NoFavorites = () => {
  return (
    <div className="flex flex-col h-[50vh] justify-center items-center">
      <IoHeartOutline className="text-9xl text-gray-400" size={100} />
      <span className="text-3xl my-2">No hay pokemons favoritos</span>
    </div>
  );
}
