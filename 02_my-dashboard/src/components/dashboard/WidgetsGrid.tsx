'use client'
import React from 'react'
import { SimpleWidget } from '../index.'
import { useAppSelector } from '@/store'
import { IoCafeOutline } from 'react-icons/io5'

export const WidgetsGrid = () => {

    const contador = useAppSelector((state) => state.counterReducer.contador)
    console.log({contador})

  return (
    <div className="flex flex-wrap mt-2 p-2 bg-slate-200 rounded-lg items-center justify-center">
        <SimpleWidget
            title="Contador"
            data={contador.toString()}
            subtitle="Carrito de compras"
            href="counter"
            icon={<IoCafeOutline size={50} className="text-indigo-600" />}
        />
    </div>
  )
}
