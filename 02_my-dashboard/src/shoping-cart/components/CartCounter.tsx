'use client'
import { useAppDispatch, useAppSelector } from '@/store';
import { addOne, subtractOne, resetContador, initContador } from '@/store/counter/counterSlice';
import React, { useEffect, useState } from 'react'

interface Propiedades{
    value?: number;
}

export const CartCounter = ({value = 0 }:Propiedades) => {

  //const [contador, setContador] = useState(value)
  const contador = useAppSelector((state) => state.counterReducer.contador)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initContador(value))
  }, [value, dispatch])

  return (
    <>
        <span className="text-9xl">{contador}</span>
        <div className="flex">
            <button 
              onClick={()=>dispatch(subtractOne())}
              className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2">
            -1
            </button>
            <button 
              onClick={()=>dispatch(addOne())}
              className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2">
            +1
            </button>
            <button 
              onClick={()=>dispatch(resetContador(0))}
              className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2">
            Reset
            </button>
        </div>
    </>
  )
}
