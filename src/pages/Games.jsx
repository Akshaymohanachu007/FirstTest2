import React, { useState, useEffect } from 'react';
import { fetchGames, fetchGameplayVideo } from '../data/videos';
import { useNavigate } from 'react-router-dom';

function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGames = async () => {
      try {
        const gamesData = await fetchGames();
        setGames(gamesData);
      } catch (error) {
        console.error('Error loading games:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const handleGameClick = async (game) => {
    try {
      setLoadingVideo(game.id);
      const videoId = await fetchGameplayVideo(game.name);

      if (videoId) {
        navigate(`/video/${videoId}`, {
          state: {
            isGame: true,
            gameData: {
              name: game.name,
              background_image: game.background_image,
              rating: game.rating,
              released: game.released
            }
          }
        });
      } else {
        alert('No gameplay video found for this game');
      }
    } catch (error) {
      console.error('Error loading gameplay video:', error);
      alert('Failed to load gameplay video');
    } finally {
      setLoadingVideo(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-zinc-600 border-t-white rounded-full animate-spin"></div>
          <p className="text-white font-medium">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#0f0f0f] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Games</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {games && games.length > 0 ? (
          games.map((game) => (
            <div
              key={game.id}
              className="bg-zinc-800 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:bg-zinc-700 hover:shadow-xl hover:shadow-red-600/20 cursor-pointer group relative"
              onClick={() => handleGameClick(game)}
            >
            
              {loadingVideo === game.id && (
                <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center z-30">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

           
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />

               
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGameClick(game);
                    }}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/40 font-semibold px-5 py-2.5 rounded-full transition-all duration-300 transform active:scale-95"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch Gameplay
                  </button>
                </div>
              </div>

              <h3 className="text-white font-semibold">{game.name}</h3>
              <p className="text-zinc-400 text-sm">Rating: {game.rating}</p>
              <p className="text-zinc-400 text-sm">Released: {game.released}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-zinc-400">
            No games found
          </div>
        )}
      </div>
    </div>
  );
}

export default Games;