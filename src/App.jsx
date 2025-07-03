import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import PokemonDetail from "./pages/PokemonDetail";
import SearchResults from "./pages/SearchResults";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const TRACKING_ID = "G-W8Y8SV4292";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
  }, []);

  return (
    <>
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="pokemon/:name" element={<PokemonDetail />} />
          <Route path="search" element={<SearchResults />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
