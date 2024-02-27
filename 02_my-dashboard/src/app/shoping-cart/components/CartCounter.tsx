'use client'
import React, { useState } from 'react'

interface Propiedades{
    value?: number;
}

export const CartCounter = ({value = 0 }:Propiedades) => {

  const [contador, setContador] = useState(value)

  return (
    <>
        <span className="text-9xl">{contador}</span>
        <div className="flex">
            <button onClick={()=>setContador(contador - 1)} className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2">
            -1
            </button>
            <button onClick={()=>setContador(contador + 1)} className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2">
            +1
            </button>
        </div>
    </>
  )
}
