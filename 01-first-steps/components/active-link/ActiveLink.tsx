'use client'

import Link from "next/link";
import style from './ActiveLink.module.css';
import { usePathname } from "next/navigation";

interface Props {
    path: string;
    text: string;
    parametroOpcional?: string
}

export const ActiveLink = ({path, text}:Props) => {
    const pathName = usePathname(); // por este hook es q se utiliza  el client component 'use client'

  return (
    <Link className={ `${style.link} ${(pathName === path) && style['active-link']}`}
        href={path} >
            {text}
    </Link>
  )
}
