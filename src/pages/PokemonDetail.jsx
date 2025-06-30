import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPokemon, fetchPokemonSpecies } from "../api/pokemonApi";
import Loader from "../components/Loader";
import { colourToBg, statsBg } from "../api/colourToBg";
import EvolutionChain from "../components/EvolutionChain";
import { FaAngleLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function PokemonDetail() {
  const { name } = useParams();
  const [gifError, setGifError] = useState(false);

  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["PokemonDetail", name],
    queryFn: async () => {
      const species = await fetchPokemonSpecies(name);
      const pokemon = await fetchPokemon(name);
      return { species, pokemon };
    },
    enabled: !!name,
  });

  console.log("data", data);

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading Pokémon data.</p>;

  const pokemonId = data.pokemon.id;
  console.log("pokemonId:");
  const gifUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;

  const genUrl = data.species.generation.url;
  const genUrlParts = genUrl.split("/").filter(Boolean);
  const genId = Number(genUrlParts[genUrlParts.length - 1]);

  const backText = window.history.length > 2 ? "Go Back" : "Back to Home";
  const handleBackClick = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <div className="container mx-auto px-5 py-10">
        <button
          onClick={handleBackClick}
          className="flex items-center bg-gray-200 hover:bg-gray-300 py-2 px-3 rounded-full cursor-pointer mb-10"
        >
          <FaAngleLeft className="mr-2" />
          {backText}
        </button>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-[47%] mb-6">
            <div
              className={`${
                colourToBg[data.species.color?.name]
              } relative w-full rounded-2xl p-6 md:p-10`}
            >
              <img
                src={
                  data.pokemon.sprites.other["official-artwork"].front_default
                }
                alt={data.pokemon.name}
                className="w-full h-auto mx-auto"
              />
              {!gifError && (
                <div className="w-[13%] absolute top-4 right-4">
                  <img
                    src={gifUrl}
                    alt={`${data.pokemon.name} gif`}
                    loading="lazy"
                    onError={() => setGifError(true)}
                    className="w-full h-auto mx-auto"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="w-full md:w-[47%]">
            <ul className="flex flex-wrap gap-2 mb-5">
              <li className="bg-orange-400 capitalize px-3 py-2 rounded-full font-medium">
                <Link to={`/?genId=${genId}`}>
                  {data.species.generation.name
                    .replace("generation-", "GEN ")
                    .toUpperCase()}
                </Link>
              </li>
              {data.pokemon.types?.map((type) => (
                <li
                  key={type.type.name}
                  className="bg-yellow-200 capitalize px-3 py-2 rounded-full font-medium text-blue-500"
                >
                  <Link to={`/?type=${type.type.name}`}>{type.type.name}</Link>
                </li>
              ))}
            </ul>
            <h1 className="text-4xl capitalize mb-5">
              {data.pokemon.name} (ID: {data.pokemon.id})
            </h1>
            <p className="mb-5">
              <b>Height:</b> {data.pokemon.height}, <b>Weight:</b>{" "}
              {data.pokemon.weight}
            </p>
            <div className="mb-5">
              <audio controls>
                <source src={data.pokemon.cries.latest} type="audio/ogg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            <div className="mb-5">
              <h3 className="text-xl font-semibold mb-1">Abilities:</h3>
              <ul className="list-disc pl-5">
                {data.pokemon.abilities.map((ab) => (
                  <li key={ab.ability.name}>
                    {ab.ability.name} {ab.is_hidden && "(Hidden Ability)"}
                  </li>
                ))}
              </ul>
            </div>{" "}
            <div>
              <h3 className="text-xl font-semibold mb-1">Stats:</h3>
              <ul className="">
                {data.pokemon.stats.map((stat) => (
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
                        className={`${
                          statsBg[data.species.color?.name]
                        } absolute top-0 left-0 rounded-tl-2xl rounded-bl-2xl h-3  !border-0 block`}
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

        <EvolutionChain
          evolution_chain_url={data.species.evolution_chain.url}
        />
      </div>
    </>
  );
}
