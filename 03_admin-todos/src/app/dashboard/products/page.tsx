import { metadata } from "@/app/layout";
import { products } from "@/data/products";
import { ProductCard } from "@/products";
import { Suspense } from "react";

async function WidgetProductsPage() {
  
  return (
    <>
      {
        products.map(producto=>(
            <ProductCard key={producto.id} {...producto}/>
        ))
      }
    </>
  ) 
}


metadata.title='ProducCard'
export default async function ProductsPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <Suspense fallback={<div role="status">Cargando pestañas...</div>}>
        {/* ProductCard */}
        <WidgetProductsPage/>
      </Suspense>
    </div>
  );
}