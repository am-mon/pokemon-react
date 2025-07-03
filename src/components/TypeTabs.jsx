import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";

const fetchTypes = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/type/");
  if (!res.ok) throw new Error("Failed to fetch types");

  const data = await res.json();
  console.log("types:", data);
  return data;
};

export default function TypeTabs({ selectedType, onSelectType }) {
  const {
    data: types,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pokemonTypes"],
    queryFn: fetchTypes,
  });

  // if (isLoading) {
  //   return <Loader />;
  // }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const allTypes = [{ name: "all" }, ...(types?.results || [])];

  return (
    <div>
      <div className="flex flex-wrap gap-2 my-4">
        {allTypes?.map((type) => {
          const typeName = type.name === "all" ? "all" : type.name;

          return (
            <button
              onClick={() => onSelectType(typeName)}
              key={type.name}
              className={`${
                selectedType === typeName ? "bg-yellow-400" : "bg-yellow-200"
              } capitalize px-3 py-2 rounded-full font-medium transition cursor-pointer hover:bg-yellow-400 bg-gray-100`}
            >
              {type.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
