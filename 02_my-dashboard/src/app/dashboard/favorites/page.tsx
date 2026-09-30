import { FavoritePokemons } from "@/pokemos";
import { Metadata } from "next";




export const metadata: Metadata = {
  title: 'Favorites',
  description: 'description SEO title'
}

export default function FavoritesPage() {
'use cache'; // Esto es para que nextjs sepa que esta pagina es estatica y no se vuelva a generar
  return (
    <div className="flex flex-col">
      <span className="text-5xl my-2">Pokemos favoritos <small className="text-blue-500">Global state</small></span>
      <FavoritePokemons />
    </div>
  );
}