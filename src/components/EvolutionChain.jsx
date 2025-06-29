import React, { useEffect, useState } from "react";
import { fetchPokemonSpecies, fetchEvolutionChain } from "../api/pokemonApi";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";

export default function EvolutionChain({ speciesUrl, color }) {
  const [evolutionData, setEvolutionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!speciesUrl) return;

    const fetchChain = async () => {
      try {
        const species = await fetchPokemonSpecies(speciesUrl);
        const chainUrl = species.evolution_chain.url;
        const evolution = await fetchEvolutionChain(chainUrl);
        setEvolutionData(evolution);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchChain();
  }, [speciesUrl]);

  if (error) return <div>Error: {error}</div>;
  if (!evolutionData) return <div>Loading Evolution Chain...</div>;

  {
    console.log("evolutionData:", evolutionData);
  }

  function flattenEvolutionChain(chain) {
    let speciesList = [];

    function recurse(currentChain) {
      speciesList.push(currentChain.species);
      currentChain.evolves_to.forEach(recurse);
    }

    recurse(chain);
    return speciesList;
  }

  const speciesList = evolutionData
    ? flattenEvolutionChain(evolutionData.chain)
    : [];

  return (
    <div className="mt-14">
      <h3 className="text-3xl font-semibold mb-7 text-center">Evolutions</h3>
      <ul className="flex flex-col md:flex-row gap-3 items-center justify-center">
        {speciesList.map((species, index) => {
          const id = species.url.split("/").filter(Boolean).pop();
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
          const itemWidth =
            speciesList.length > 3 ? "w-[18%]" : "w-full mg:w-[25%] lg:w-[22%]";

          return (
            <React.Fragment key={species.name}>
              <li
                key={species.name}
                className={`text-center rounded-2xl p-5 ${itemWidth} ${color}`}
              >
                <Link to={`/pokemon/${species.name}`}>
                  <img
                    src={imageUrl}
                    alt={species.name}
                    className="w-[90%] mx-auto"
                  />
                  <h3 className="text-center text-2xl mt-5 ">{species.name}</h3>
                </Link>
              </li>
              {!(index === speciesList.length - 1) && (
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
