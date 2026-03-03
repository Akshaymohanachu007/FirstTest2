import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMovies, fetchMovieTrailer } from '../data/videos';
import axios from 'axios';

function Movies() {
  const [moviePosters, setMoviePosters] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const posters = await fetchMovies(1);
        setMoviePosters(posters);
        
       
        const TMDB_API_KEY = "7a2eff7e9a5854a96a3c901210d3dcf8";
        const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
          params: {
            api_key: TMDB_API_KEY,
            sort_by: 'popularity.desc',
            page: 1,
          },
        });
        setMovieData(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const handleWatchTrailer = async (movieIndex) => {
    const movie = movieData[movieIndex];
    if (movie) {
      const trailerUrl = await fetchMovieTrailer(movie.id);
      if (trailerUrl) {
     
        const videoId = trailerUrl.split('v=')[1];
        navigate(`/video/${videoId}`);
      } else {
        alert('No trailer available for this movie');
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">Loading movies...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Movies</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {moviePosters.map((poster, index) => (
          <div 
            key={index} 
            className="relative group transform transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer"
            onClick={() => handleWatchTrailer(index)}
          >
            <img 
              src={poster} 
              alt={`Movie ${index + 1}`} 
              className="w-full object-cover aspect-[2/3] transition-opacity duration-300 group-hover:opacity-50" 
            />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
              <span className="text-white font-medium border border-white px-4 py-2 rounded-full">
                View Trailer
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Movies;