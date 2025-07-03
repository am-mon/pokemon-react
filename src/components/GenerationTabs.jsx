import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";

const fetchGenerations = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/generation/");
  if (!res.ok) throw new Error("Failed to fetch generations");

  const data = await res.json();
  console.log("generations:", data);
  return data;
};

export default function GenerationTabs({ selectedGenId, onSelectGen }) {
  const {
    data: generations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pokemonGenerations"],
    queryFn: fetchGenerations,
  });

  // if (isLoading) {
  //   return <Loader />;
  // }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 my-4">
        {generations?.results.map((gen) => {
          const editedName = gen.name
            .replace("generation-", "GEN ")
            .toUpperCase();
          const urlparts = gen.url.split("/").filter(Boolean);
          const genId = Number(urlparts[urlparts.length - 1]);
          return (
            <button
              onClick={() => {
                onSelectGen(genId);
              }}
              key={gen.name}
              className={`${
                selectedGenId === genId ? "bg-orange-400" : "bg-orange-200"
              } capitalize px-3 py-2 rounded-full font-medium transition cursor-pointer hover:bg-orange-400 bg-gray-100`}
            >
              {editedName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
