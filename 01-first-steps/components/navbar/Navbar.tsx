import { HomeIcon } from "@primer/octicons-react";
import Link from "next/link";
import { ActiveLink } from "../active-link/ActiveLink";


const temporalAsync = () => { // just to test async logic
    return new Promise<boolean>((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, 2000);
    })
}

const navItems = [
    {path:'/about', text: 'About'},
    {path:'/pricing', text: 'Pricing'},
    {path:'/contact', text: 'Contact'}
]

export const Navbar = async () => {
    console.log("Nabvar");
    if (await temporalAsync()) {
        console.log("Nabvarrrrrrr");        
    }
  return (
    <nav className='flex bg-blue-800 bg-opacity-30 p-2 m-2 rounded'>
        <Link href={'/'} className="flex items-center">
            <HomeIcon className="mr-1"/>
            <span>Home</span>
        </Link>
        
        <div className='flex flex-1'></div>

        {
            navItems.map(ni => <ActiveLink  key={ni.text} {...ni} />)
        }
        
        {/* <Link className='mr-2' href="/pricing">Pricing</Link>
        <Link className='mr-2' href="/contact">Contact</Link> */}
    </nav>
  )
}
