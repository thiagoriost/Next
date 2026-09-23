
import { SimplePokemon } from "../interfaces/simple-pokemon";
import { PokemonCard } from "./PokemonCard";

interface Props{
    pokemos: SimplePokemon[]
}

export const PokemonGrid = ({pokemos}:Props) => {
  return (
    <div className="flex flex-wrap gap-10 items-center justify-center" >
        {
          pokemos.map(({id, name}) => (
            <PokemonCard key={id} id={id} name={name} />
            

          ))
        }
      </div>
  )
}
