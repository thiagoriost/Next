/* esto es desde el lado del cliente */

import { getCookie, hasCookie } from "cookies-next"

/* 
cookie: cart
{
    'uui-123-1':4,
    'uui-123-2':1,
    'uui-123-3':2,
}
 */

export const getCookieCart = ():{[id:string]:number}=>{

    if (hasCookie('cart')) {
        const cookieCart = JSON.parse(getCookie('cart') as string)
        console.log({cookieCart})
        return cookieCart;
    }
    return {}
}