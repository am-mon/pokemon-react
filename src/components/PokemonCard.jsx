import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colourToBg } from "../api/colourToBg";
import { fetchPokemon, fetchPokemonSpecies } from "../api/pokemonApi";
import { useQuery } from "@tanstack/react-query";

export default function PokemonCard({ id, name, onClick }) {
  const {
    data: pokemonData,
    // isLoading: isPokemonLoading,
    // isError: isPokemonError,
    // error: pokemonError,
  } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => fetchPokemon(id),
  });

  const speciesUrl = pokemonData?.species?.url;

  const {
    data: species,
    // isLoading,
    // isError,
    // error,
  } = useQuery({
    queryKey: ["pokemonSpecies", speciesUrl],
    queryFn: () => fetchPokemonSpecies(speciesUrl),
    enabled: !!speciesUrl,
  });

  const color = species?.color?.name || "gray";
  const bgClass = colourToBg[color] || "bg-gray-200 text-gray-900";

  const officialArtworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const gifUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;

  const [gifError, setGifError] = useState(false);

  const navigate = useNavigate();

  const formatNameForUrl = (name) =>
    name.toLowerCase().replace(/ /g, "-").replace(/\./g, "").replace(/'/g, "");

  const handleClick = () => {
    const urlName = formatNameForUrl(name);
    navigate(`/pokemon/${urlName}`);
  };

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }
  // if (isError) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer flex flex-col items-center py-5 px-3 rounded-2xl shadow-lg ${bgClass}`}
    >
      <div className="relative">
        <div className={`${gifError ? "w-[80%] mx-auto" : "w-[70%]"}`}>
          <img
            src={officialArtworkUrl}
            alt={name}
            className="w-40 h-40 w-auto h-auto mb-2"
            loading="lazy"
          />
        </div>
        {!gifError && (
          <div className="w-[30%] absolute top-0 right-0">
            <img
              src={gifUrl}
              alt={`${name} gif`}
              className="w-auto h-auto"
              loading="lazy"
              onError={() => setGifError(true)}
            />
          </div>
        )}
      </div>
      <h3 className="text-2xl capitalize mb-4">{name}</h3>
      <div className="text-center text-sm">
        <div className="capitalize gap-1 flex flex-wrap justify-center">
          <span className={`${bgClass} rounded-full px-2 uppercase`}>
            {species?.generation?.name.replace("generation-", "GEN ") ||
              "Unknown"}
          </span>
          {pokemonData?.types?.map(({ type }) => (
            <span key={type.name} className={`${bgClass} rounded-full px-2`}>
              {type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
