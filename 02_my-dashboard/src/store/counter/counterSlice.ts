import { createSlice } from '@reduxjs/toolkit'

interface CounterState {
    contador: number;
    isReady: boolean;
}

const initialState: CounterState = {
    contador: 5,
    isReady: false
}

const counterSlice = createSlice({
  name: 'contador',
  initialState,
  reducers: {
    initContador(state, action: { payload: number }) {
        if (state.isReady) return;
        state.contador = action.payload
        state.isReady = true
    },
    addOne(state) {
      state.contador += 1
    },
    subtractOne(state) {
      state.contador -= 1
    },
    resetContador(state, action: { payload: number }) {
        if (action.payload < 0) action.payload = 0;
        state.contador = action.payload
    }
    
  }
});

export const { addOne, subtractOne, resetContador, initContador } = counterSlice.actions

export default counterSlice.reducer