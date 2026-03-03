import axios from 'axios';

// Dynamic API key
let getApiKey = () => import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyAbKVKs8Cpj4wt0lDikf6lNPlcJj7famug';

export const setApiKeyGetter = (getter) => {
  getApiKey = getter;
};

const getYouTubeApiKey = () => getApiKey();
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const formatDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  if (!match) {
    return '0:00';
  }

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatViews = (viewCount) => {
  console.log('formatViews called with:', viewCount); 

  if (!viewCount || viewCount === undefined) return '0 views';

  const views = parseInt(viewCount);
  if (isNaN(views)) {
    console.log('viewCount is NaN after parseInt:', viewCount);
    return '0 views';
  }

  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

const formatTimestamp = (publishedAt) => {
  const date = new Date(publishedAt);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};


export const getLocalVideos = () => {
  return [
    { id: 1, title: "Local Video 1", thumbnail: "https://picsum.photos/seed/video1/640/360", views: "100K", duration: "5:30", channelName: "Local Channel", channelAvatar: "LC", timestamp: "2 days ago" },
    { id: 2, title: "Local Video 2", thumbnail: "https://picsum.photos/seed/video2/640/360", views: "200K", duration: "3:45", channelName: "Local Channel", channelAvatar: "LC", timestamp: "1 week ago" },
    { id: 3, title: "Local Video 3", thumbnail: "https://picsum.photos/seed/video3/640/360", views: "150K", duration: "8:20", channelName: "Local Channel", channelAvatar: "LC", timestamp: "3 days ago" },
    { id: 4, title: "Local Video 4", thumbnail: "https://picsum.photos/seed/video4/640/360", views: "300K", duration: "2:15", channelName: "Local Channel", channelAvatar: "LC", timestamp: "1 week ago" },
    { id: 5, title: "Local Video 5", thumbnail: "https://picsum.photos/seed/video5/640/360", views: "250K", duration: "6:40", channelName: "Local Channel", channelAvatar: "LC", timestamp: "4 days ago" },
    { id: 6, title: "Local Video 6", thumbnail: "https://picsum.photos/seed/video6/640/360", views: "180K", duration: "4:30", channelName: "Local Channel", channelAvatar: "LC", timestamp: "2 weeks ago" },
    { id: 7, title: "Local Video 7", thumbnail: "https://picsum.photos/seed/video7/640/360", views: "220K", duration: "7:10", channelName: "Local Channel", channelAvatar: "LC", timestamp: "5 days ago" },
    { id: 8, title: "Local Video 8", thumbnail: "https://picsum.photos/seed/video8/640/360", views: "190K", duration: "3:55", channelName: "Local Channel", channelAvatar: "LC", timestamp: "1 week ago" },
    { id: 9, title: "Local Video 9", thumbnail: "https://picsum.photos/seed/video9/640/360", views: "280K", duration: "5:25", channelName: "Local Channel", channelAvatar: "LC", timestamp: "3 days ago" },
    { id: 10, title: "Local Video 10", thumbnail: "https://picsum.photos/seed/video10/640/360", views: "160K", duration: "4:00", channelName: "Local Channel", channelAvatar: "LC", timestamp: "2 weeks ago" },
    { id: 11, title: "Local Video 11", thumbnail: "https://picsum.photos/seed/video11/640/360", views: "210K", duration: "6:15", channelName: "Local Channel", channelAvatar: "LC", timestamp: "6 days ago" },
    { id: 12, title: "Local Video 12", thumbnail: "https://picsum.photos/seed/video12/640/360", views: "240K", duration: "3:30", channelName: "Local Channel", channelAvatar: "LC", timestamp: "1 week ago" },
    { id: 13, title: "Local Video 13", thumbnail: "https://picsum.photos/seed/video13/640/360", views: "170K", duration: "8:45", channelName: "Local Channel", channelAvatar: "LC", timestamp: "2 weeks ago" },
    { id: 14, title: "Local Video 14", thumbnail: "https://picsum.photos/seed/video14/640/360", views: "290K", duration: "2:40", channelName: "Local Channel", channelAvatar: "LC", timestamp: "4 days ago" },
    { id: 15, title: "Local Video 15", thumbnail: "https://picsum.photos/seed/video15/640/360", views: "130K", duration: "5:50", channelName: "Local Channel", channelAvatar: "LC", timestamp: "1 week ago" },
    { id: 16, title: "Local Video 16", thumbnail: "https://picsum.photos/seed/video16/640/360", views: "260K", duration: "4:20", channelName: "Local Channel", channelAvatar: "LC", timestamp: "3 days ago" },
    { id: 17, title: "Local Video 17", thumbnail: "https://picsum.photos/seed/video17/640/360", views: "200K", duration: "7:30", channelName: "Local Channel", channelAvatar: "LC", timestamp: "2 weeks ago" },
    { id: 18, title: "Local Video 18", thumbnail: "https://picsum.photos/seed/video18/640/360", views: "230K", duration: "3:15", channelName: "Local Channel", channelAvatar: "LC", timestamp: "5 days ago" },
    { id: 19, title: "Local Video 19", thumbnail: "https://picsum.photos/seed/video19/640/360", views: "270K", duration: "6:00", channelName: "Local Channel", channelAvatar: "LC", timestamp: "1 week ago" },
    { id: 20, title: "Local Video 20", thumbnail: "https://picsum.photos/seed/video20/640/360", views: "140K", duration: "4:45", channelName: "Local Channel", channelAvatar: "LC", timestamp: "3 days ago" }
  ];
};
export const getLocalVideoById = (id) => {
  const videos = getLocalVideos();
  return videos.find(video => video.id === Number(id));
};

export const getLocalVideoPath = (id) => {
  return `/videos/video${id}.mp4`;
};

export const getPopularVideos = async (maxResults = 20) => {
  try {
    console.log('Making API call to:', `${BASE_URL}/videos`);
    console.log('API Key:', getYouTubeApiKey() ? 'Set' : 'Not set');
    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        regionCode: 'US',
        maxResults,
        key: getYouTubeApiKey(),
      },
    });

    console.log('API Response:', response.data);

    if (!response.data.items || response.data.items.length === 0) {
      console.log('No items in response');
      return [];
    }

    return response.data.items.map(item => ({
      id: item.id,
      thumbnail: item.snippet.thumbnails.medium.url,
      duration: formatDuration(item.contentDetails.duration),
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      channelAvatar: item.snippet.thumbnails.default.url,
      views: formatViews(item.statistics.viewCount),
      timestamp: formatTimestamp(item.snippet.publishedAt),
    }));
  } catch (error) {
    console.error('Full error object:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

export const getVideoById = async (videoId) => {
  try {
    console.log('Fetching video by ID:', videoId);
    console.log('API URL:', `${BASE_URL}/videos`);

    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        key: getYouTubeApiKey(),
      },
    });

    console.log('Video API Response:', response.data);

    const item = response.data.items[0];
    if (!item) {
      console.log('No video found for ID:', videoId);
      return null;
    }

    const formattedVideo = {
      id: item.id,
      thumbnail: item.snippet.thumbnails.high.url,
      title: item.snippet.title,
      views: formatViews(item.statistics.viewCount),
      date: formatTimestamp(item.snippet.publishedAt),
      likes: formatViews(item.statistics.likeCount),
      duration: formatDuration(item.contentDetails.duration),
      channelName: item.snippet.channelTitle,
      channelAvatar: item.snippet.thumbnails.default.url,
    };

    console.log('Formatted video data:', formattedVideo);
    return formattedVideo;
  } catch (error) {
    console.error('Error fetching video details:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

export const dummyVideos = [
  {
    id: 1,
    thumbnail: "https://picsum.photos/seed/tech1/640/360",
    duration: "12:45",
    title: "Building a High-Performance Streaming UI with Tailwind CSS",
    channelName: "Design System Pro",
    channelAvatar: "https://i.pravatar.cc/150?u=dsp",
    views: "1.2M",
    timestamp: "2 days ago"
  },
  {
    id: 2,
    thumbnail: "https://picsum.photos/seed/gradient/640/360",
    duration: "45:10",
    title: "Lo-fi Beats for Late Night Coding & Focus",
    channelName: "Chilled Studio",
    channelAvatar: "https://i.pravatar.cc/150?u=chilled",
    views: "42K",
    timestamp: "Live now",
    isLive: true
  },
  {
    id: 3,
    thumbnail: "https://picsum.photos/seed/tech2/640/360",
    duration: "08:22",
    title: "Top 10 Gadgets for Your Minimalist Desk Setup 2024",
    channelName: "Tech Minimalist",
    channelAvatar: "https://i.pravatar.cc/150?u=tm",
    views: "890K",
    timestamp: "1 week ago",
    progress: 70
  },
  {
    id: 4,
    thumbnail: "https://picsum.photos/seed/code/640/360",
    duration: "2:15:30",
    title: "Full-Stack JavaScript Masterclass: From Zero to Hero",
    channelName: "Code Academy",
    channelAvatar: "JS",
    views: "2.5M",
    timestamp: "1 month ago"
  }
];

export const searchVideos = async (query, maxResults = 20) => {
  try {
    console.log('API_KEY:', getYouTubeApiKey());

    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults,
        key: getYouTubeApiKey(),
      },
    });

    if (!response.data.items || response.data.items.length === 0) {
      return [];
    }

   
    const videoIds = response.data.items.map(item => item.id.videoId).join(',');

   
    const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'statistics,contentDetails',
        id: videoIds,
        key: getYouTubeApiKey(),
      },
    });

    console.log('Search results:', response.data.items.length);
    console.log('Details response:', detailsResponse.data.items.length);
    console.log('Full details response sample:', detailsResponse.data.items[0]);


    return response.data.items.map((item, index) => {
      const details = detailsResponse.data.items[index];
      if (!details) {
        console.log('No details found for index:', index);
        return null;
      }


      const viewCount = details.statistics?.viewCount;
      const duration = details.contentDetails?.duration;

      console.log(`Video ${index} details:`, {
        id: item.id.videoId,
        title: item.snippet.title,
        viewCount,
        duration,
        hasStatistics: !!details.statistics,
        hasContentDetails: !!details.contentDetails,
        fullStatistics: details.statistics,
        fullContentDetails: details.contentDetails
      });

      return {
        id: item.id.videoId,
        thumbnail: item.snippet.thumbnails.medium.url,
        duration: duration ? formatDuration(duration) : '0:00',
        title: item.snippet.title || 'Untitled',
        channelName: item.snippet.channelTitle || 'Unknown Channel',
        channelAvatar: item.snippet.thumbnails?.default?.url || null,
        views: viewCount ? (() => {
          console.log('Calling formatViews with viewCount:', viewCount);
          const formatted = formatViews(viewCount);
          console.log('formatViews returned:', formatted);
          return formatted;
        })() : '0 views',
        timestamp: formatTimestamp(item.snippet.publishedAt),
      };
    }).filter(Boolean); 
  } catch (error) {
    console.error('Error searching videos:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// TMDB API Configuration
const TMDB_API_KEY = "7a2eff7e9a5854a96a3c901210d3dcf8";
const TMDB_BASE_URL = "https://api.themoviedb.org/3/discover/movie";
const TMDB_IMG_URL = "https://image.tmdb.org/t/p/w500";

export const fetchMovies = async (page = 1) => {
  const res = await fetch(`${TMDB_BASE_URL}?api_key=${TMDB_API_KEY}&page=${page}`);
  const data = await res.json();

  const posters = data.results
    .filter(m => m.poster_path)
    .map(m => TMDB_IMG_URL + m.poster_path);

  console.log(posters);
  return posters;
};
//TMDB TV Shows API
export const fetchTVShows = async (query = 'popular', page = 1) => {
  const TMDB_API_KEY = "7a2eff7e9a5854a96a3c901210d3dcf8";
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";
  
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query,
        include_adult: false,
        language: 'en-US',
        page: page,
      },
    });

    const tvShows = response.data.results.map(show => ({
      id: show.id,
      title: show.name,
      poster: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null,
      overview: show.overview,
      firstAirDate: show.first_air_date,
      voteAverage: show.vote_average
    })).filter(show => show.poster !== null);

    console.log('TV Shows fetched:', tvShows.length);
    return tvShows;
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return [];
  }
};

//RAWG API CALL


export const fetchGames = async () => {
  const RAWG_API_KEY = "c40416c0af8b4464943c97352ed448c2";

  try {
    const response = await axios.get("https://api.rawg.io/api/games", {
      params: {
        key: RAWG_API_KEY,
        page_size: 20,
      },
    });

    console.log(response.data.results);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
};

export const fetchGameplayVideo = async (gameName) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: `${gameName} gameplay`,
        type: 'video',
        maxResults: 1,
        key: getYouTubeApiKey(),
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0].id.videoId;
    }
    return null;
  } catch (error) {
    console.error('Error fetching gameplay video:', error);
    return null;
  }
};

export const fetchMusicVideo = async (trackName, artistName) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: `${trackName} ${artistName} official music video`,
        type: 'video',
        maxResults: 1,
        key: getYouTubeApiKey(),
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0].id.videoId;
    }
    return null;
  } catch (error) {
    console.error('Error fetching music video:', error);
    return null;
  }
};


export const fetchTVShowVideo = async (showTitle, year) => {
  try {
    const searchQuery = year ? `${showTitle} ${year} trailer` : `${showTitle} trailer`;
    
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        maxResults: 1,
        key: getYouTubeApiKey(),
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0].id.videoId;
    }
    return null;
  } catch (error) {
    console.error('Error fetching TV show video:', error);
    return null;
  }
};


//........................


export const fetchMovieTrailer = async (movieId) => {
  const TMDB_API_KEY = "7a2eff7e9a5854a96a3c901210d3dcf8";

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
      },
    });

    const trailers = response.data.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');
    if (trailers.length > 0) {
      return `https://www.youtube.com/watch?v=${trailers[0].key}`;
    }
    return null;
  } catch (error) {
    console.error('Error fetching movie trailer:', error);
    return null;
  }
};


//Music API call using TheAudioDB
export const fetchTracks = async () => {
  try {
    const response = await axios.get(
      "https://www.theaudiodb.com/api/v1/json/123/track-top10.php?s=coldplay"
    );
 
    return response.data.track || [];
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return [];
  }
};

export const testTheAudioDB = async () => {
  try {
    console.log('Testing TheAudioDB API...');

 
    const response = await axios.get(
      "https://www.theaudiodb.com/api/v1/json/123/searchtrack.php?s=coldplay"
    );

    console.log('API Response:', response.data);
    console.log('Tracks found:', response.data.track?.length || 0);

    return response.data.track || [];
  } catch (error) {
    console.error("Error testing TheAudioDB:", error);
    return [];
  }
};

export const fetchMusicFromiTunes = async () => {
  try {
    const response = await axios.get(
      'https://itunes.apple.com/search?term=coldplay&entity=musicTrack&limit=20'
    );
    
    const tracks = response.data.results.map(track => ({
      idTrack: track.trackId,
      strTrack: track.trackName,
      strArtist: track.artistName,
      strAlbum: track.collectionName,
      previewUrl: track.previewUrl,
      artworkUrl100: track.artworkUrl100
    }));
    
    console.log('iTunes tracks fetched:', tracks.length);
    return tracks;
  } catch (error) {
    console.error('Error fetching from iTunes:', error);
    return [];
  }
};


export const searchTracksByArtist = async (artistName = 'coldplay') => {
  try {
    const response = await axios.get(
      `https://www.theaudiodb.com/api/v1/json/123/searchtrack.php?s=${artistName}`
    );

    return response.data.track || [];
  } catch (error) {
    console.error("Error searching tracks:", error);
    return [];
  }
};


export const fetchPopularTracks = async () => {
  const artists = ['coldplay', 'adele', 'ed sheeran', 'taylor swift', 'drake'];
  const allTracks = [];

  try {
    for (const artist of artists) {
      const response = await axios.get(
        `https://www.theaudiodb.com/api/v1/json/123/searchtrack.php?s=${artist}`
      );

      if (response.data.track) {
        allTracks.push(...response.data.track.slice(0, 5)); 
      }
    }

    console.log('Popular tracks fetched:', allTracks.length);
    return allTracks;
  } catch (error) {
    console.error("Error fetching popular tracks:", error);
    return [];
  }
};