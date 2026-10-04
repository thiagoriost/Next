// https://redux.js.org/toolkit/api/getDefaultMiddleware

import {Action, Dispatch, MiddlewareAPI } from "@reduxjs/toolkit";
import { RootState } from "..";

export const localStorageMiddleware = (state: MiddlewareAPI) => {
  
    return (next: Dispatch) => (action: Action) => {
        
        next(action);
        console.log("localStorageMiddleware",{getState: state.getState(), state, action});

        if (action.type === 'pokemons/toggleFavorite') {
            const {pokemonsReducer } = state.getState() as RootState;
            localStorage.setItem('favorite-pokemons', JSON.stringify(pokemonsReducer));
            
        }

        /* const result = next(action);
        localStorage.setItem('state', JSON.stringify(state.getState()));
        return result; */
    }
}