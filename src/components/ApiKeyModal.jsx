import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useApiKey } from '../contexts/ApiKeyContext';

const ApiKeyModal = ({ isOpen, onClose }) => {
  const { apiKey, updateApiKey, hasCustomKey } = useApiKey();
  const [localApiKey, setLocalApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLocalApiKey(apiKey);
      setSaveStatus('');
    }
  }, [isOpen, apiKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (localApiKey.trim()) {
      setIsSaving(true);
      setSaveStatus('');
      
      try {
        const success = updateApiKey(localApiKey.trim());
        if (success) {
          setSaveStatus('API key saved successfully!');
          setTimeout(() => {
            setLocalApiKey('');
            onClose();
          }, 1000);
        } else {
          setSaveStatus('Failed to save API key');
        }
      } catch (error) {
        setSaveStatus('Error saving API key');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleClose = () => {
    setLocalApiKey('');
    setSaveStatus('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-[#1f1f1f] p-6 text-white">
          <Dialog.Title className="text-lg font-semibold mb-4">
            YouTube API Key Settings
          </Dialog.Title>
          
          {hasCustomKey && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-600 rounded-md">
              <p className="text-sm text-green-300">
                ✓ Custom API key is currently active
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={hasCustomKey ? "Enter new API key to replace current" : "Enter your YouTube API key"}
                required
              />
            </div>
            
            {saveStatus && (
              <div className={`mb-4 p-3 rounded-md text-sm ${
                saveStatus.includes('success') 
                  ? 'bg-green-900/30 border border-green-600 text-green-300' 
                  : 'bg-red-900/30 border border-red-600 text-red-300'
              }`}>
                {saveStatus}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !localApiKey.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ApiKeyModal;