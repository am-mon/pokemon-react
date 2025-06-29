import React from "react";
import PokemonCard from "./PokemonCard";

export default function PokemonListDisplay({ pokemons }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {pokemons.map((pokemon) => {
        const parts = pokemon.url.split("/").filter(Boolean);
        const id = parts[parts.length - 1];
        return <PokemonCard key={id} id={id} name={pokemon.name} />;
      })}
    </div>
  );
}
