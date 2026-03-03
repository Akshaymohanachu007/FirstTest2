import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';


function Watchpage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const state = location.state;
        if (state?.isTVShow && state?.showData) {
          
          setShowInfo(state.showData);
          setVideoId(id); 
        } else if (state?.isMovie && state?.movieData) {
          setShowInfo(state.movieData);
          const match = state.movieData.trailerUrl?.match(/v=([^&]+)/);
          setVideoId(match ? match[1] : '');
        } else if (id) {
          setVideoId(id);
        } else {
          setError('No content available');
        }
      } catch (err) {
        setError('Connection failed');
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, [location, id]);

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (error) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans">
     
      {showInfo?.backdropPath && (
        <div className="fixed inset-0 z-0">
          <img
            src={`https://image.tmdb.org/t/p/original${showInfo.backdropPath}`}
            className="w-full h-full object-cover opacity-10 blur-3xl scale-110"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </div>
      )}
      
      {showInfo?.poster && !showInfo?.backdropPath && (
        <div className="fixed inset-0 z-0">
          <img
            src={showInfo.poster}
            className="w-full h-full object-cover opacity-10 blur-3xl scale-110"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </div>
      )}
      <div className="relative z-10">
        
      
       
        <main className="px-0 lg:px-12 pb-20">
          <div className="w-full overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] border-y lg:border lg:rounded-3xl border-white/5 bg-black">
            {videoId ? (
              <VideoPlayer
                videoId={videoId}
                contentType={location.state?.isTVShow ? 'tvshow' : location.state?.isMovie ? 'movie' : location.state?.isGame ? 'game' : 'video'}
                contentData={showInfo}
              />
            ) : (
              <div className="aspect-video flex flex-col items-center justify-center gap-4 text-zinc-500">
                <div className="text-4xl">🎬</div>
                <p className="italic font-medium">Trailer preview unavailable</p>
              </div>
            )}
          </div>


        </main>
      </div>
    </div>
  );
}

const Stat = ({ label, value, color = "text-white" }) => (
  <div>
    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-base font-bold ${color}`}>{value}</p>

  </div>
);

export default Watchpage;