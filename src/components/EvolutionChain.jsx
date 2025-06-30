import React, { useEffect, useState } from "react";
import { fetchEvolutionChain } from "../api/pokemonApi";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { colourToBg } from "../api/colourToBg";
import { FaChevronRight } from "react-icons/fa6";
import PokemonCard from "./PokemonCard";

export default function EvolutionChain({ evolution_chain_url }) {
  const [evoChainList, setEvoChainList] = useState([]);
  const [detailedChains, setDetailedChains] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["EvolutionChain", evolution_chain_url],
    queryFn: () => fetchEvolutionChain(evolution_chain_url),
    enabled: !!evolution_chain_url,
  });

  console.log("data", data);

  useEffect(() => {
    const getChains = [];
    getChains.push({
      name: data?.chain.species.name,
      url: data?.chain.species.url,
    });
    data?.chain.evolves_to.forEach((evolve) => {
      getChains.push({ name: evolve.species.name, url: evolve.species.url });
      evolve.evolves_to.forEach((nextEvolve) => {
        getChains.push({
          name: nextEvolve.species.name,
          url: nextEvolve.species.url,
        });
      });
    });
    setEvoChainList(getChains);
  }, [data]);

  useEffect(() => {
    if (!evoChainList.length) return;

    const fetchAllChains = async () => {
      const results = await Promise.all(
        evoChainList.map(async ({ name, url }) => {
          if (!url) return null;
          const res = await fetch(url);
          const speciesData = await res.json();

          const pokemonUrl = speciesData.varieties?.[0]?.pokemon?.url;
          let pokemonId = null;
          if (pokemonUrl) {
            pokemonId = pokemonUrl.split("/").filter(Boolean).pop();
          }

          return {
            id: pokemonId,
            name,
          };
        })
      );
      setDetailedChains(results.filter(Boolean));
    };
    fetchAllChains();
  }, [evoChainList]);

  if (isLoading) return <p>Loading evolution chain...</p>;
  if (error) return <p>Error loading Pokémon data.</p>;

  return (
    <div className="container mx-auto mt-14">
      <h3 className="text-3xl font-semibold mb-8 text-center">
        Evolution Chain
      </h3>
      {/* <div>{JSON.stringify(evoChainList, 2, null)}</div> */}
      <ul className="flex flex-wrap flex-col md:flex-row gap-x-3 gap-y-5 items-center justify-center">
        {detailedChains.map((chain, index) => {
          const itemWidth =
            detailedChains.length > 4
              ? "w-full md:w-[23%] lg:w-[15%]"
              : "w-full md:w-[25%] lg:w-[20%]";
          return (
            <React.Fragment key={chain.id}>
              <li className={`text-center rounded-2xl ${itemWidth}`}>
                <PokemonCard id={chain.id} name={chain.name} />
              </li>
              {!(index === detailedChains.length - 1) && (
                <li>
                  <FaChevronRight className="text-5xl text-gray-400 rotate-90 md:rotate-0" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
}
