import { CartCounter } from "@/shoping-cart";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'Shoping cart',
  description: 'description SEO title'
}

export default function CounterPage() {


  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <span>Productos en el carrito</span>
      <CartCounter value={15} />
      

    </div>
  );
}