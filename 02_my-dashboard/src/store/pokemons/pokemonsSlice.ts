// rxslice snippet
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SimplePokemon } from '@/pokemos/interfaces/simple-pokemon';

interface PokemonsState {
  [key: string]: SimplePokemon

}

const initialState: PokemonsState = {
    '1': { id: '1', name: 'bulbasaur'},
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