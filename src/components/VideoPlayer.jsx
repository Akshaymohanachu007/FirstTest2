import React, { useState, useEffect } from 'react';
import { getLocalVideoById, getVideoById, fetchGames, fetchTVShows, getPopularVideos, searchVideos } from '../data/videos';
import { useNavigate } from 'react-router-dom';
import ShareModal from './ShareModal';

function VideoPlayer({ videoId, contentType = 'video', contentData }) {
  const [videoData, setVideoData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        let data = getLocalVideoById(videoId);
        if (!data) {
          try {
            data = await getVideoById(videoId);
          } catch (apiError) {
            data = {
              id: videoId,
              title: "Bruno Mars - Risk It All [Official Music Video]",
              views: '395K',
              likes: '45K',
              subscribers: '36.8M',
              channelName: 'Bruno Mars',
              channelAvatar: 'https://i.pravatar.cc/150?u=bruno',
              description: 'Official music video for "Risk It All" by Bruno Mars. ℗ 2026 Atlantic Recording.'
            };
          }
        }
        setVideoData(data);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) fetchVideoDetails();
  }, [videoId]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        let recs = [];

        switch (contentType) {
          case 'game':
            const gamesData = await fetchGames();
            recs = gamesData.slice(0, 5).map(game => ({
              id: game.id,
              title: game.name,
              thumbnail: game.background_image,
              channelName: 'Gaming',
              views: `${Math.floor(Math.random() * 1000)}K views`,
              duration: `${Math.floor(Math.random() * 20)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
              type: 'game',
              data: game
            }));
            break;
            
          case 'tvshow':
            const tvShowsData = await fetchTVShows('popular');
            recs = tvShowsData.slice(0, 5).map(show => ({
              id: show.id,
              title: show.title,
              thumbnail: show.poster,
              channelName: 'TV Shows',
              views: `${Math.floor(Math.random() * 1000)}K views`,
              duration: `${Math.floor(Math.random() * 20)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
              type: 'tvshow',
              data: show
            }));
            break;
            
          case 'movie':
   
            const searchResults = await searchVideos('trailer', 5);
            recs = searchResults.map(video => ({
              id: video.id,
              title: video.title,
              thumbnail: video.thumbnail,
              channelName: video.channelName,
              views: video.views,
              duration: video.duration,
              type: 'video'
            }));
            break;
            
          default:
      
            const popularVideos = await getPopularVideos(5);
            recs = popularVideos.map(video => ({
              id: video.id,
              title: video.title,
              thumbnail: video.thumbnail,
              channelName: video.channelName,
              views: video.views,
              duration: video.duration,
              type: 'video'
            }));
        }

        setRecommendations(recs);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [contentType]);

  const handleRecommendationClick = async (rec) => {
    if (rec.type === 'game') {
      const { fetchGameplayVideo } = await import('../data/videos');
      const videoId = await fetchGameplayVideo(rec.data.name);
      if (videoId) {
        navigate(`/video/${videoId}`, {
          state: {
            isGame: true,
            gameData: rec.data
          }
        });
      }
    } else if (rec.type === 'tvshow') {
      const { fetchTVShowVideo } = await import('../data/videos');
      const year = rec.data.firstAirDate ? rec.data.firstAirDate.split('-')[0] : '';
      const videoId = await fetchTVShowVideo(rec.data.title, year);
      if (videoId) {
        navigate(`/video/${videoId}`, {
          state: {
            isTVShow: true,
            showData: rec.data
          }
        });
      }
    } else {
      navigate(`/video/${rec.id}`);
    }
  };

  if (loading) return <LoadingSpinner />;

  const youtubeVideoId = videoId?.length === 11 ? videoId : 'dQw4w9WgXcQ';
  const videoSrc = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&modestbranding=1&rel=0`;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="w-full h-full bg-[#050505] text-slate-50 font-sans">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 p-4 lg:p-8">
        

        <div className="xl:col-span-8 space-y-6">
          <div className="relative group">

            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
              <iframe className="w-full h-full" src={videoSrc} title="Player" allowFullScreen />
            </div>
          </div>

          <div className="px-2">
            <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-white leading-tight">
              {videoData?.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-white/5">
              <div className="flex items-center gap-4">
                <img src={videoData?.channelAvatar} className="w-12 h-12 rounded-full border border-white/10" alt="" />
                <div>
                  <h3 className="font-bold text-lg">{videoData?.channelName}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-full border border-white/5 backdrop-blur-md">
                <button className="flex items-center gap-2 px-5 py-2 hover:bg-white/10 rounded-full transition">
                  <span className="text-purple-500 text-xl">♥</span> {videoData?.likes}
                </button>
                <div className="w-px h-6 bg-white/10" />
                
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-5 py-2 hover:bg-white/10 rounded-full transition text-zinc-400"
                >
                  Share
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-zinc-900/40 rounded-2xl border border-white/5 text-sm leading-relaxed text-zinc-300">
              <p className="font-bold text-white mb-1">{videoData?.views} views • 2 hours ago</p>
              {videoData?.description}
            </div>
          </div>
        </div>

        {/* Dynamic Recommendations */} 
        <div className="xl:col-span-4">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-purple-600 rounded-full" /> 
            {contentType === 'game' ? 'More Games' : contentType === 'tvshow' ? 'More TV Shows' : 'Up Next'}
          </h2>
          
          {loadingRecommendations ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-3 p-2 rounded-2xl">
                  <div className="w-40 h-24 bg-zinc-800 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                    <div className="h-3 bg-zinc-800 rounded w-3/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div 
                  key={`${rec.id}-${index}`} 
                  className="group flex gap-3 p-2 rounded-2xl hover:bg-white/5 transition border border-transparent hover:border-white/5 cursor-pointer"
                  onClick={() => handleRecommendationClick(rec)}
                >
                  <div className="relative w-40 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-800">
                    <img 
                      src={rec.thumbnail} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                      alt={rec.title}
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-[10px] font-bold rounded">
                      {rec.duration}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-sm line-clamp-2 text-zinc-100 group-hover:text-purple-400 transition">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1">{rec.channelName}</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">{rec.views}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal 
        open={showShareModal} 
        setOpen={setShowShareModal}
        videoUrl={currentUrl}
        videoTitle={videoData?.title}
      />
    </div>
  );
}

const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
  </div>
);

export default VideoPlayer;