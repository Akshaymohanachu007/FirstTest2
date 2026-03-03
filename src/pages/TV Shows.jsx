import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTVShows, fetchTVShowVideo } from '../data/videos';

function TVShows() {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTVShows = async () => {
      try {
        const showsData = await fetchTVShows('popular');
        setTvShows(showsData);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTVShows();
  }, []);

  const handleViewTrailer = async (showIndex) => {
    try {
      setLoadingVideo(showIndex);
      const show = tvShows[showIndex];
      const year = show.firstAirDate ? show.firstAirDate.split('-')[0] : '';
      
      const videoId = await fetchTVShowVideo(show.title, year);
      
      if (videoId) {
        navigate(`/video/${videoId}`, {
          state: {
            isTVShow: true,
            showData: {
              title: show.title,
              poster: show.poster,
              firstAirDate: show.firstAirDate,
              voteAverage: show.voteAverage,
              overview: show.overview
            }
          }
        });
      } else {
        alert('No video found for this TV show');
      }
    } catch (error) {
      console.error('Error loading TV show video:', error);
      alert('Failed to load video');
    } finally {
      setLoadingVideo(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-zinc-600 border-t-white rounded-full animate-spin"></div>
          <p className="text-zinc-400 font-medium">Loading TV shows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Popular TV Shows</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 lg:gap-8">
        {tvShows.map((show, index) => (
          <div 
            key={show.id} 
            className="flex flex-col group cursor-pointer"
            onClick={() => handleViewTrailer(index)}
          >
            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-white/5 bg-zinc-900">
              <img 
                src={show.poster} 
                alt={show.title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
              />
              
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1 shadow-lg z-20">
                <span className="text-yellow-400 text-xs">⭐</span>
                <span className="text-white text-xs font-bold">{show.voteAverage?.toFixed(1) || 'NR'}</span>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />

              {/* Loading overlay */}
              {loadingVideo === index && (
                <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center z-30">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 z-20">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewTrailer(index);
                  }}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/40 font-semibold px-5 py-2.5 rounded-full transition-all duration-300 transform active:scale-95"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Now
                </button>
              </div>
            </div>
            
            <div className="mt-3 px-1">
              <h3 className="text-white text-base font-bold truncate tracking-wide group-hover:text-blue-400 transition-colors duration-300">
                {show.title}
              </h3>
              
              <div className="flex items-center gap-2 mt-1.5 text-zinc-400 text-sm font-medium">
                <span>{show.firstAirDate ? show.firstAirDate.split('-')[0] : 'N/A'}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                <span className="text-[10px] uppercase tracking-wider border border-zinc-600 px-1.5 py-0.5 rounded-sm text-zinc-300">
                  TV
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TVShows;