import { createSlice } from '@reduxjs/toolkit'

interface CounterState {
    contador: number;
}

const initialState: CounterState = {
    contador: 5
}

const counterSlice = createSlice({
  name: 'contador',
  initialState,
  reducers: {
    
  }
});

export const {} = counterSlice.actions

export default counterSlice.reducer