import React, { useState, useEffect } from 'react';
import VideoCard from "./VideoCard";
import { getPopularVideos } from '../data/videos';

const VideoSection = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        console.log('Fetching videos from YouTube API...');
        const videoData = await getPopularVideos(); 
        setVideos(videoData);
        console.log('Videos fetched:', videoData);
      } catch (err) {
        console.error('API failed, using local data:', err);
        const { getLocalVideos } = await import('../data/videos');
        setVideos(getLocalVideos());
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4 bg-[#0f0f0f] min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading videos...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4 bg-[#0f0f0f] min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-orange-500 text-center">
            <div>{error}</div>
            <div className="text-sm mt-2">Showing sample videos instead</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4 bg-[#0f0f0f] min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 max-w-[1800px] mx-auto">
        {videos.map((video, index) => (
          <VideoCard
            key={video.id || index}
           id={video.id}
            thumbnail={video.thumbnail}
            title={video.title}
            channelName={video.channelName}
            channelAvatar={video.channelAvatar}
            views={video.views}
            timestamp={video.timestamp}
            isLive={video.isLive}
            progress={video.progress}
          />
        ))}
      </div>
    </main>
  );
};

export default VideoSection;