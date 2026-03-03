import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Movies from "./pages/Movies";
import SearchResults from "./pages/SearchResults";
import "./index.css";
import Games from "./pages/Games";
import { ApiKeyProvider } from "./contexts/ApiKeyContext";

import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Watchpage from "./pages/Watchpage";
import TVShows from "./pages/TV Shows";
import Music from "./pages/Music";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout/>,
    
    children: [
      {index:true, element: <Home/>},
       {path: "video/:id",element:<Watchpage/>},
      {path: "movies",element:<Movies/>},
      {path: "search", element: <SearchResults />},
      {path: "games", element: <Games />},
      {path: "tvshows", element: <TVShows />},
      {path: "music", element: <Music />}, 
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApiKeyProvider>
      <RouterProvider router={router} />
    </ApiKeyProvider>
  </StrictMode>
);