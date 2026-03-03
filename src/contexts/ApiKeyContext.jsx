import React, { createContext, useContext, useState, useEffect } from 'react';

const ApiKeyContext = createContext();

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};

export const ApiKeyProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(() => {

    const savedKey = localStorage.getItem('youtubeApiKey');
    if (savedKey) {
      return savedKey;
    }
 
    return import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyAbKVKs8Cpj4wt0lDikf6lNPlcJj7famug';
  });

  const updateApiKey = (newApiKey) => {
    if (newApiKey && newApiKey.trim()) {
      const trimmedKey = newApiKey.trim();
      setApiKey(trimmedKey);
      localStorage.setItem('youtubeApiKey', trimmedKey);
      return true;
    }
    return false;
  };

  const clearApiKey = () => {
    setApiKey(import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyAbKVKs8Cpj4wt0lDikf6lNPlcJj7famug');
    localStorage.removeItem('youtubeApiKey');
  };

  const value = {
    apiKey,
    updateApiKey,
    clearApiKey,
    hasCustomKey: localStorage.getItem('youtubeApiKey') !== null
  };

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export default ApiKeyContext;
