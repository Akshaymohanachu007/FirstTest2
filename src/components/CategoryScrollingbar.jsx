import React from "react";
import { Link } from "react-router-dom";

function CategoryScrollingbar() {
  return (
    <nav className="flex gap-3 overflow-x-auto px-4 py-3 bg-black border-b border-white/10 relative z-20">

      {/* All */}
      <Link to="/">
        <button
          className="
            whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors duration-200
            rounded-lg bg-white text-black
          "
        >
          All
        </button>
      </Link>



      {/* Gaming */}
      <Link to="/Games">
        <button

          className="
            whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors duration-200
            rounded-lg bg-white/10 text-white hover:bg-white/20
          "
        >
          Gaming
        </button>
      </Link>

      {/* Music */}
      <Link to="/Music">
        <button
          className="
            whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors duration-200
            rounded-lg bg-white/10 text-white hover:bg-white/20
          "
        >
          Music
        </button>
      </Link>

      {/* TV Shows */}
      <Link to="/tvshows">
        <button className="whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded-lg bg-white/10 text-white hover:bg-white/20">
          TV Shows
        </button>
      </Link>



{/*       
      <Link to="/category/Comedy">
        <button
          className="
            whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors duration-200
            rounded-lg bg-white/10 text-white hover:bg-white/20
          "
        >
          Comedy
        </button>
      </Link> */}


      {/* Comedy */}
      <Link to="/Movies">
        <button
          className="
            whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors duration-200
            rounded-lg bg-white/10 text-white hover:bg-white/20
          "
        >
          Movies
        </button>
      </Link>

    </nav>
  );
}

export default CategoryScrollingbar;