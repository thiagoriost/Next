"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'

/** Propiedades necesarias para representar un elemento de navegación lateral. */
interface SidebarItemProps {
  /** Icono que acompaña al título del enlace. */
  icon: React.ReactNode;
  /** Ruta de destino y referencia para determinar si el elemento está activo. */
  path: string;
  /** Texto descriptivo del elemento. */
  title: string;
}

/**
 * Muestra un enlace de navegación e indica visualmente si corresponde a la ruta actual.
 * @param props Icono, ruta y título del elemento.
 */
export const SidebarItem = ({ icon, path, title }: SidebarItemProps) => {

  const pathName = usePathname();

  const [counter, setCounter] = useState(10)

  return (
    <li onClick={()=>setCounter(counter + 1)}>
      <Link
          href={path}
          className={`
            px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group
            hover:bg-gray-100 hover:text-gray-700
            ${pathName === path ? 'text-white bg-gradient-to-r from-sky-600 to-cyan-400' : ''}
          `}
          >
          {icon}
          <span className="group-hover:text-gray-700">{title}_{counter}</span>
      </Link>
    </li>
  )
}
