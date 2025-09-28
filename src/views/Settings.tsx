import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const Settings = () => {
  const [homepage, setHomepage] = useState('https://reversesearch.co.in');
  const [searchEngine, setSearchEngine] = useState('https://www.google.com/search?q=');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Try to use Tauri store if available
        if (typeof window !== 'undefined' && window.__TAURI__) {
          const { Store } = await import("@tauri-apps/plugin-store");
          const store = await Store.load(".settings.dat");
          
          const savedHomepage = await store.get('homepage') as string;
          const savedSearchEngine = await store.get('searchEngine') as string;
          const savedTheme = await store.get('theme') as 'light' | 'dark';

          setHomepage(savedHomepage || 'https://reversesearch.co.in');
          setSearchEngine(savedSearchEngine || 'https://www.google.com/search?q=');
          setTheme(savedTheme || 'light');
        } else {
          // Fallback to localStorage for web preview
          const savedHomepage = localStorage.getItem('chrome_homepage');
          const savedSearchEngine = localStorage.getItem('chrome_search_engine');
          const savedTheme = localStorage.getItem('chrome_theme') as 'light' | 'dark';

          setHomepage(savedHomepage || 'https://reversesearch.co.in');
          setSearchEngine(savedSearchEngine || 'https://www.google.com/search?q=');
          setTheme(savedTheme || 'light');
        }
      } catch (error) {
        console.log('Using default settings due to storage error:', error);
      } finally {
        setIsLoading(false);
      }
      
      // Apply theme immediately
      document.documentElement.classList.toggle('dark', theme === 'dark');
    };

    loadSettings();
  }, []);

  useEffect(() => {
    // Update theme class when theme changes
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const saveSettings = async () => {
    try {
      // Try to use Tauri store if available
      if (typeof window !== 'undefined' && window.__TAURI__) {
        const { Store } = await import("@tauri-apps/plugin-store");
        const store = await Store.load(".settings.dat");
        
        await store.set('homepage', homepage);
        await store.set('searchEngine', searchEngine);
        await store.set('theme', theme);
        await store.save();
      } else {
        // Fallback to localStorage for web preview
        localStorage.setItem('chrome_homepage', homepage);
        localStorage.setItem('chrome_search_engine', searchEngine);
        localStorage.setItem('chrome_theme', theme);
      }
      
      // Apply theme
      document.documentElement.classList.toggle('dark', theme === 'dark');
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="chrome-page">
        <div className="chrome-page-header">
          <button 
            className="chrome-back-btn"
            onClick={() => window.history.back()}
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="chrome-page-title">Settings</h1>
        </div>
        <div className="chrome-page-content">
          <div className="chrome-empty-state">
            <p>Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chrome-page">
      <div className="chrome-page-header">
        <button 
          className="chrome-back-btn"
          onClick={() => window.history.back()}
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="chrome-page-title">Settings</h1>
      </div>
      
      <div className="chrome-page-content">
        <div className="chrome-settings-container">
          <div className="chrome-settings-section">
            <h2 className="chrome-settings-title">Appearance</h2>
            <div className="chrome-setting-item">
              <label className="chrome-setting-label">Theme</label>
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark')} 
                className="chrome-setting-select"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          <div className="chrome-settings-section">
            <h2 className="chrome-settings-title">Search and Navigation</h2>
            <div className="chrome-setting-item">
              <label className="chrome-setting-label">Homepage URL</label>
              <input 
                type="url"
                value={homepage} 
                onChange={(e) => setHomepage(e.target.value)} 
                className="chrome-setting-input"
                placeholder="https://example.com"
              />
            </div>
            
            <div className="chrome-setting-item">
              <label className="chrome-setting-label">Default Search Engine</label>
              <select
                value={searchEngine}
                onChange={(e) => setSearchEngine(e.target.value)}
                className="chrome-setting-select"
              >
                <option value="https://www.google.com/search?q=">Google</option>
                <option value="https://www.bing.com/search?q=">Bing</option>
                <option value="https://duckduckgo.com/?q=">DuckDuckGo</option>
                <option value="https://reversesearch.co.in/search?q=">ReverseSearch</option>
              </select>
            </div>
          </div>

          <div className="chrome-settings-actions">
            <button 
              onClick={saveSettings} 
              className="chrome-btn-primary"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;