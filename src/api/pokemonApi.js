//Pokemon by Generation
export async function fetchPokemonsByGeneration(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/generation/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch Pokémons");
  }

  const data = await res.json();
  console.log("Pokemons by Gen:", data);
  return data;
}

//Pokemon by Type
export async function fetchPokemonsByType(typeName) {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);

  if (!res.ok) {
    throw new Error("Failed to fetch Pokémons");
  }

  const data = await res.json();
  console.log("Pokemons by Types:", data);
  return data.pokemon.map((entry) => entry.pokemon.name);
}

//Get PokemonSpecies for color themes, evolution etc...
export async function fetchPokemonSpecies(speciesUrlOrId) {
  let url = "";

  if (typeof speciesUrlOrId === "string" && speciesUrlOrId.startsWith("http")) {
    url = speciesUrlOrId;
  } else {
    url = `https://pokeapi.co/api/v2/pokemon-species/${speciesUrlOrId}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch species");
  const data = await res.json();
  return data;
}

//For Detail Page
export async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon data for ID: ${id}`);
  }
  const data = await res.json();
  console.log("Pokemon Details:", data);
  return data;
}

// Fetch Evolution Chain
export async function fetchEvolutionChain(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch evolution chain");
  const data = await res.json();
  return data;
}
