import React, { useEffect, useState } from "react";
import {
  fetchPokemonsByGeneration,
  fetchPokemonsByType,
} from "../api/pokemonApi";
import { useQuery } from "@tanstack/react-query";
import GenerationTabs from "./GenerationTabs";
import Loader from "./Loader";
import TypeTabs from "./TypeTabs";
import PokemonListDisplay from "./PokemonListDisplay";
import { useSearchParams } from "react-router-dom";
import iconFilter from "../assets/images/icon-filter.svg";

export default function PokemonListWithTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileGenOpen, setMobileGenOpen] = useState(false);
  const [mobileTypeOpen, setMobileTypeOpen] = useState(false);

  // read from URL query params or use default values
  const genId = Number(searchParams.get("genId")) || 1;
  const selectedType = searchParams.get("type") || "all";

  // update URL when gen or type changes
  const setGenId = (newGenId) => {
    searchParams.set("genId", newGenId);
    setSearchParams(searchParams);
  };

  const setSelectedType = (newType) => {
    searchParams.set("type", newType);
    setSearchParams(searchParams);
  };

  // scroll to top on gen/type change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileGenOpen(false);
    setMobileTypeOpen(false);
  }, [genId, selectedType]);

  const {
    data: pokemonsByGen,
    error,
    isLoading: isLoadingGen,
    isError,
  } = useQuery({
    queryKey: ["pokemonsByGen", genId],
    queryFn: () => fetchPokemonsByGeneration(genId),
  });

  const { data: pokemonsByType, isLoading: isTypeLoading } = useQuery({
    queryKey: ["pokemonsByType", selectedType],
    queryFn: () => fetchPokemonsByType(selectedType),
    enabled: selectedType !== "all",
  });

  if (isLoadingGen || isTypeLoading) {
    return <Loader />;
  }
  if (isError) return <div>Error: {error.message}</div>;

  const filteredPokemons = pokemonsByGen?.pokemon_species?.filter((pokemon) => {
    if (selectedType === "all") return true;
    return pokemonsByType?.includes(pokemon.name);
  });

  const handleMobileGenOpen = () => {
    setMobileGenOpen(!mobileGenOpen);
    setMobileTypeOpen(false);
  };

  const handleMobileTypeOpen = () => {
    setMobileTypeOpen(!mobileTypeOpen);
    setMobileGenOpen(false);
  };

  return (
    <div>
      <div className="md:hidden flex justify-between gap-2">
        <button
          onClick={handleMobileGenOpen}
          className={`w-[50%] flex items-center justify-center bg-orange-100 border-2 border-orange-400 h-13 px-3 uppercase font-medium text-lg text-center rounded-xl cursor-pointer ${
            mobileGenOpen && "bg-orange-400"
          }`}
        >
          Gen {genId}
          <img src={iconFilter} alt="Filter" className="ml-2" />
        </button>
        <button
          onClick={handleMobileTypeOpen}
          className={`w-[50%] flex items-center justify-center bg-yellow-100 border-2 border-yellow-400 h-13 px-3 capitalize font-medium text-lg text-center rounded-xl cursor-pointer ${
            mobileTypeOpen && "bg-yellow-400"
          }`}
        >
          {selectedType} <img src={iconFilter} alt="Filter" className="ml-2" />
        </button>
      </div>
      <div className={`${mobileGenOpen ? "block" : "hidden"} md:block`}>
        <GenerationTabs selectedGenId={genId} onSelectGen={setGenId} />
      </div>
      <div className={`${mobileTypeOpen ? "block" : "hidden"} md:block`}>
        <TypeTabs selectedType={selectedType} onSelectType={setSelectedType} />
      </div>

      {filteredPokemons && (
        <>
          <h3 className="my-6 text-2xl">
            <span className="text-blue-500">
              {filteredPokemons?.length} Pokémon
            </span>{" "}
            found in Generation <span className="text-orange-500">{genId}</span>{" "}
            with type <span className="text-yellow-400">{selectedType}</span>.
          </h3>
          <PokemonListDisplay pokemons={filteredPokemons} />
        </>
      )}
    </div>
  );
}
