import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiKey } from '../contexts/ApiKeyContext';
import { setApiKeyGetter } from '../data/videos';
import SearchBar from './SearchBar';
import VoiceSearch from './VoiceSearch';
import ApiKeyModal from './ApiKeyModal';

const Header = () => {
  const { apiKey } = useApiKey();
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150?u=user");
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  const handleVoiceSearch = () => {
    setIsVoiceSearchOpen(true);
  };

  const handleVoiceSearchClose = () => {
    setIsVoiceSearchOpen(false);
  };

  const handleVoiceSearchResult = (query) => {
    handleSearch(query);
  };

  const handleApiKeyOpen = () => {
    setIsApiKeyModalOpen(true);
  };

  const handleApiKeyClose = () => {
    setIsApiKeyModalOpen(false);
  };

  const handleProfileClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target.result);
          localStorage.setItem('userProfileImage', e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  useEffect(() => {
    const savedImage = localStorage.getItem('userProfileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  useEffect(() => {
    setApiKeyGetter(() => apiKey);
  }, [apiKey]);

  return (
    <header className="flex items-center justify-between bg-black px-4 py-2 text-white sticky top-0 z-50 shadow-md font-sans">

      <div className="flex items-center space-x-4 flex-shrink-0">
        <a href="/" className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white pl-0.5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="ml-2 text-xl font-bold tracking-tight hidden sm:inline">
            Stream<span className="text-purple-500">Grid</span>
          </span>
        </a>
      </div>

      {/* Search Bar  */}
      <div className="flex flex-grow justify-center items-center mx-2 sm:mx-4 lg:mx-10 max-w-2xl">
        <div className="flex-grow">
          <SearchBar onSearch={handleSearch} placeholder="Search..." />
        </div>

        {/* Voice Search Button */}
        <button
          onClick={handleVoiceSearch}
          className="ml-2 p-2.5 bg-[#1f1f1f] hover:bg-[#3f3f3f] rounded-full transition-colors flex-shrink-0"
          title="Search with your voice"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white" focusable="false">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zM17.3 11c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path>
          </svg>
        </button>
      </div>

      <div className="flex items-center space-x-2">

        <button
          onClick={handleApiKeyOpen}
          className="p-2 bg-[#1f1f1f] hover:bg-[#3f3f3f] rounded-full transition-colors"
          title="API Key Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={handleProfileClick}
          className="p-2 bg-[#1f1f1f] hover:bg-[#3f3f3f] rounded-full transition-colors"
          title="User Profile"
        >
          <img
            src={profileImage}
            alt="User Profile"
            className="w-6 h-6 rounded-full object-cover cursor-pointer"
          />
        </button>
      </div>

      {isVoiceSearchOpen && (
        <VoiceSearch
          isOpen={isVoiceSearchOpen}
          onClose={handleVoiceSearchClose}
          onSearch={handleVoiceSearchResult}
        />
      )}

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={handleApiKeyClose}
      />

    </header>
  );
};

export default Header;