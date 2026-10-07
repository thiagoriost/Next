// rxslice snippet
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SimplePokemon } from '@/pokemos/interfaces/simple-pokemon';

interface PokemonsState {
  favorites: {[key: string]: SimplePokemon} 
}

/* 
{
  pokemos:[],
  favorites: {
    1: {id: '1', name: 'bulbasaur'},
    2: {id: '2', name: 'ivysaur'},
    3: {id: '3', name: 'venusaur'},
  }
}
 */

/* const getIniitialState = (): PokemonsState => {

  // if (typeof localStorage === 'undefined') return {};
  const favorites = JSON.parse(localStorage.getItem('favorite-pokemons') ?? '{}');
  
  return favorites;
}; */

const initialState: PokemonsState = {
  // ...getIniitialState()
  favorites: {}
};

const pokemonsSlice = createSlice({
  name: 'pokemons',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<SimplePokemon>) {
      const { id } = action.payload;
      if (state.favorites[id]) {
        delete state.favorites[id];
      } else {
        state.favorites[id] = action.payload;
      }
      console.log("pokemonsSlice",{state, action})
      localStorage.setItem('favorite-pokemons', JSON.stringify(action.payload));
    },
    setFavoritesPokemons(state, action: PayloadAction<{[key: string]: SimplePokemon}>) {
      console.log("setFavoritesPokemons", {state, action});
      state.favorites = action.payload;
    }
  }
});

export const { toggleFavorite, setFavoritesPokemons } = pokemonsSlice.actions

export default pokemonsSlice.reducer