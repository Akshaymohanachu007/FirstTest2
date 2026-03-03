import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMusicFromiTunes, testTheAudioDB, fetchMusicVideo } from '../data/videos';

function Music() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTracks = async () => {
      try {
      
        const testTracks = await testTheAudioDB();
        console.log('direct Api test:', testTracks);

        const trackData = await fetchMusicFromiTunes();
        setTracks(trackData);
        console.log("Tracks loaded:", trackData);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, []);

  const handlePlayTrack = async (track, index) => {
    try {
      setLoadingVideo(index);
      const videoId = await fetchMusicVideo(track.strTrack, track.strArtist);
      
      if (videoId) {
        navigate(`/video/${videoId}`, {
          state: {
            isMusic: true,
            trackData: {
              strTrack: track.strTrack,
              strArtist: track.strArtist,
              strAlbum: track.strAlbum,
              artworkUrl100: track.artworkUrl100
            }
          }
        });
      } else {
        alert('No music video found for this track');
      }
    } catch (error) {
      console.error('Error loading music video:', error);
      alert('Failed to load music video');
    } finally {
      setLoadingVideo(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">Loading music...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Popular Music Tracks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tracks.map((track, index) => (
          <div
            key={`${track.idTrack}-${index}`}
            className="relative group transform transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer bg-zinc-800 rounded-lg p-4"
            onClick={() => handlePlayTrack(track, index)}
          >
            {loadingVideo === index && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                {track.artworkUrl100 ? (
                  <img 
                    src={track.artworkUrl100} 
                    alt={track.strTrack}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl">♪</span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-white text-sm font-semibold truncate">{track.strTrack}</h3>
                <p className="text-zinc-400 text-xs truncate">{track.strArtist}</p>
                <p className="text-zinc-500 text-xs">{track.strAlbum}</p>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-lg">
              <div className="text-center">
                <div className="text-white font-medium mb-2">Click to watch music video</div>
                <div className="text-zinc-400 text-xs"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Music;