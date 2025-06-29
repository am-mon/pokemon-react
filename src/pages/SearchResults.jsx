import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import PokemonListDisplay from "../components/PokemonListDisplay";

export default function SearchResults() {
  const [keyword] = useSearchParams();
  const query = keyword.get("s")?.toLocaleLowerCase() || "";
  const [allPokemon, setAllPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeoutHandle = setTimeout(() => {
      const fetchPokemon = async () => {
        try {
          // const res = await fetch(
          //   "https://pokeapi.co/api/v2/pokemon?limit=10000"
          // );
          // const data = await res.json();
          // console.log("All Pokemon:", data.results);
          // setAllPokemon(data.results);

          //Only search from all gen listing
          const genRes = await fetch("https://pokeapi.co/api/v2/generation/");
          const genData = await genRes.json();

          const genDetails = await Promise.all(
            genData.results.map((gen) =>
              fetch(gen.url).then((res) => res.json())
            )
          );

          const allPokemonSpecies = genDetails.flatMap(
            (gen) => gen.pokemon_species
          );

          const allPokemon = allPokemonSpecies.map(({ name, url }) => ({
            name,
            url,
          }));

          setAllPokemon(allPokemon);
        } catch (error) {
          console.log("Failed to fetch Pokémon.", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPokemon();
    }, 500);
    return () => clearTimeout(timeoutHandle);
  }, []);

  useEffect(() => {
    const results = allPokemon.filter((pokemon) =>
      pokemon.name.toLocaleLowerCase().includes(query)
    );
    setFilteredPokemon(results);
    console.log("filtered:", results);
  }, [query, allPokemon]);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div className="container mx-auto px-5 py-10">
        {filteredPokemon.length > 0 ? (
          <div>
            <h3 className="text-2xl text-center mb-10">
              Search results for "{query}"
            </h3>
            <PokemonListDisplay pokemons={filteredPokemon} />
          </div>
        ) : (
          <div className="text-center text-lg py-10 px-4 min-h-[60vh] flex items-center justify-center">
            <p>
              No results for{" "}
              <span className="font-semibold text-primary">"{query}"</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
