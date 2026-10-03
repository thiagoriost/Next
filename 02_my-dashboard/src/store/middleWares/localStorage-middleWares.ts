// https://redux.js.org/toolkit/api/getDefaultMiddleware

import {Action, Dispatch, MiddlewareAPI } from "@reduxjs/toolkit";

export const localStorageMiddleware = (state: MiddlewareAPI) => {
  
    return (next: Dispatch) => (action: Action) => {
        
        console.log("localStorageMiddleware",{getState: state.getState(), state});
        
        /* const result = next(action);
        localStorage.setItem('state', JSON.stringify(state.getState()));
        return result; */
    }
}