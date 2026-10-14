import { metadata } from "@/app/layout";
import { products } from "@/data/products";
import { ProductCard } from "@/products";

metadata.title='ProducCard'
export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {/* ProductCard */}
      {
        products.map(producto=>(
            <ProductCard key={producto.id} {...producto}/>
        ))
      }
    </div>
  );
}