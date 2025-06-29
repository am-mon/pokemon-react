import React, { useState } from "react";
import logo from "../assets/images/pokemon.png";
import { Link, useNavigate } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";

export default function Header() {
  const [keyword, setKeyWord] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
      navigate(`/search?s=${keyword.trim().toLowerCase()}`);
      setKeyWord("");
    }
  };

  const handleSearchOpen = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <div className="border-t-10  border-t-yellow-400 py-4 md:py-6 bg-yellow-50">
      <div className="container mx-auto px-4 flex flex-wrap flex-row items-center justify-between">
        <div>
          <Link to="/">
            <img
              src={logo}
              alt="Pokemon"
              className="w-[165px] md:w-[190px] mx-auto"
            />
          </Link>
        </div>
        <button
          onClick={handleSearchOpen}
          className="flex md:hidden items-center justify-center bg-yellow-400 h-13 w-13 text-center rounded-xl cursor-pointer"
        >
          <BiSearchAlt className="text-3xl mx-auto" />
        </button>
        <div
          className={`w-full md:w-auto md:block mt-5 md:mt-0 ${
            searchOpen ? "block" : "hidden"
          }`}
        >
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center w-full md:w-auto"
          >
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyWord(e.target.value)}
              placeholder="Search Pokémon Name..."
              className="border-2 bg-white border-yellow-400 rounded-tl-xl rounded-bl-xl p-2 md:p-3 min-w-[80%] md:min-w-[320px] text-gray-600 font-medium h-13 text-sm md:text-base placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-yellow-400 h-13 w-13 text-center rounded-tr-xl rounded-br-xl cursor-pointer min-w-[20%] md:min-w-13"
            >
              <BiSearchAlt className="text-3xl mx-auto" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
