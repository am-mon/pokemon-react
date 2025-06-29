import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loader() {
  return (
    <>
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center gap-4 text-center text-xl font-bold">
          <AiOutlineLoading3Quarters className="animate-spin text-2xl" />
          Loading...
        </div>
      </div>
    </>
  );
}
