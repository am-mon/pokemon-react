import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loader";
import { colourToBg } from "../api/colourToBg";
import { statsBg } from "../api/colourToBg";
import EvolutionChain from "../components/EvolutionChain";

export default function PokemonDetail() {
  const { name } = useParams();
  const [gifError, setGifError] = useState(false);

  const fetchPokemonAndSpecies = async (name) => {
    try {
      const pokemonRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );
      if (!pokemonRes.ok) throw new Error("Pokemon not found");

      const speciesRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${name}`
      );
      if (!speciesRes.ok) throw new Error("Species not found");

      const pokemonData = await pokemonRes.json();
      const speciesData = await speciesRes.json();

      return { pokemonData, speciesData };
    } catch {
      // Fallback: fetch species only
      const speciesRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${name}`
      );
      if (!speciesRes.ok) throw new Error("Species not found");

      const speciesData = await speciesRes.json();

      // Get default variety's Pokémon name from species data
      const defaultVariety = speciesData.varieties.find((v) => v.is_default);
      const defaultPokemonName = defaultVariety?.pokemon?.name;

      if (!defaultPokemonName)
        throw new Error("Default Pokémon form not found");

      // Fetch default Pokémon data
      const pokemonRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${defaultPokemonName}`
      );
      if (!pokemonRes.ok) throw new Error("Default Pokémon not found");

      const pokemonData = await pokemonRes.json();

      return { pokemonData, speciesData };
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["pokemon-full", name],
    queryFn: () => fetchPokemonAndSpecies(name),
    enabled: !!name,
  });

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading Pokémon data.</p>;

  const { pokemonData: pokemon, speciesData: species } = data;
  const colorName = species.color?.name;
  const bgClass = colourToBg[colorName] || "bg-gray-100 text-gray-900";
  const statBgClass = statsBg[colorName] || "bg-gray-500";

  const pokemonId = pokemon.id;
  const gifUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;

  return (
    <div className="container mx-auto px-5 py-10">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-[47%] mb-6">
          <div className={`${bgClass} relative w-full rounded-2xl p-6 md:p-10`}>
            <div className={`${gifError ? "w-full" : "w-[90%]"}`}>
              <img
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
                className="w-full h-auto mx-auto"
              />
            </div>
            {!gifError && (
              <div className="w-[13%] absolute top-4 right-4">
                <img
                  src={gifUrl}
                  alt={`${pokemon.name} gif`}
                  className="w-full h-auto mx-auto"
                  loading="lazy"
                  onError={() => setGifError(true)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-[47%]">
          <ul className="flex flex-wrap gap-2 mb-5">
            <li className="bg-orange-400 capitalize px-3 py-2 rounded-full font-medium">
              {species.generation.name
                .replace("generation-", "GEN ")
                .toUpperCase()}
            </li>
            {pokemon.types?.map((typeInfo) => (
              <li
                key={typeInfo.type.name}
                className="bg-yellow-200 capitalize px-3 py-2 rounded-full font-medium text-blue-500"
              >
                {typeInfo.type.name}
              </li>
            ))}
          </ul>
          <h1 className="text-4xl capitalize mb-5">{pokemon.name}</h1>
          <p className="mb-5">
            <b>Height:</b> {pokemon.height}, <b>Weight:</b> {pokemon.weight}
          </p>
          <div className="mb-5">
            <audio controls>
              <source src={pokemon.cries.latest} type="audio/ogg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <div className="mb-5">
            <h3 className="text-xl font-semibold mb-1">Abilities:</h3>
            <ul className="list-disc pl-5">
              {pokemon.abilities.map((ab) => (
                <li key={ab.ability.name}>
                  {ab.ability.name} {ab.is_hidden && "(Hidden Ability)"}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">Stats:</h3>
            <ul className="">
              {pokemon.stats.map((stat) => (
                <li key={stat.stat.name} className="mb-1">
                  <div className="mb-1">
                    <b>
                      {stat.stat.name.charAt(0).toUpperCase() +
                        stat.stat.name.slice(1)}
                      :
                    </b>{" "}
                    {stat.base_stat}
                  </div>
                  <div className="w-full relative h-3 bg-gray-200 rounded-2xl overflow-hidden">
                    <span
                      className={`${statBgClass} absolute top-0 left-0 rounded-tl-2xl rounded-bl-2xl h-3  !border-0 block`}
                      style={{
                        width: `${Math.min(stat.base_stat, 100)}%`,
                      }}
                    ></span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <EvolutionChain speciesUrl={pokemon.species.url} color={bgClass} />
    </div>
  );
}
