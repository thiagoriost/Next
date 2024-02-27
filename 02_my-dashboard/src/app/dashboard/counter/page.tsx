import { CartCounter } from "@/app/shoping-cart";
import { Metadata } from "next";
import { useState } from "react";

export const metadata: Metadata = {
  title: 'Shoping cart',
  description: 'description SEO title'
}

export default function CounterPage() {


  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <span>Productos en el carrito</span>
      <CartCounter value={10} />
      

    </div>
  );
}