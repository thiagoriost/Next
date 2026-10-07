'use client';
import { Provider } from "react-redux";
import { store } from ".";
import { useEffect } from "react";
import { setFavoritesPokemons } from "./pokemons/pokemonsSlice";


interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorite-pokemons') ?? '{}');
    console.log("Providers", {favorites});
    store.dispatch(setFavoritesPokemons(favorites));
  
    return () => {}
  }, [])
  


  return (
    <Provider store={store}>
        {children}
    </Provider>
  )
}
