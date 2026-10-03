// rxslice snippet
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SimplePokemon } from '@/pokemos/interfaces/simple-pokemon';

interface PokemonsState {
  [key: string]: SimplePokemon

}

const initialState: PokemonsState = {
    /* '1': { id: '1', name: 'bulbasaur'},
    '2': { id: '2', name: 'ivysaur'},
    '3': { id: '3', name: 'venusaur'},
    '4': { id: '4', name: 'charmander'}, */
};

const pokemonsSlice = createSlice({
  name: 'pokemons',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<SimplePokemon>) {
      const { id } = action.payload;
      if (state[id]) {
        delete state[id];
      } else {
        state[id] = action.payload;
      }
      console.log({state})
    }
  }
});

export const { toggleFavorite } = pokemonsSlice.actions

export default pokemonsSlice.reducer