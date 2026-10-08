import Link from 'next/link'
import React from 'react'
import { CiBookmarkCheck } from 'react-icons/ci'

export const SidebarItem = ({ item }: { item: string }) => {
  return (
    <Link
        href="/dashboard/rest-todos"
        className="relative px-4 py-3 flex items-center space-x-4 rounded-xl text-white bg-linear-to-r from-sky-600 to-cyan-400"
        >
        <CiBookmarkCheck size={30} />
        <span className="-mr-1 font-medium">{item}</span>
    </Link>
  )
}
