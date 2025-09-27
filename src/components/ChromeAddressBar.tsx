import React, { useState, useEffect } from 'react';
import { useTabStore } from '../store/tabs';
import { useHistoryStore } from '../store/history';
import { useIncognitoStore } from '../store/incognito';
import { useZenStore } from '../store/zen';
import ChromeMenuDropdown from './ChromeMenuDropdown';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Home,
  Shield,
  Eye,
  MoreVertical,
  Lock
} from 'lucide-react';

interface ChromeAddressBarProps {
  onNavigate: (view: string) => void;
}

const ChromeAddressBar: React.FC<ChromeAddressBarProps> = ({ onNavigate }) => {
  const { tabs, activeTab } = useTabStore();
  const { addHistory } = useHistoryStore();
  const { isIncognito, toggleIncognito } = useIncognitoStore();
  const { isZen, toggleZen } = useZenStore();
  const [url, setUrl] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const activeTabData = tabs.find(t => t.id === activeTab);

  useEffect(() => {
    if (activeTabData) {
      setUrl(activeTabData.url);
    }
  }, [activeTabData]);

  const handleNavigate = (newUrl: string) => {
    if (newUrl && activeTab) {
      // Update the active tab's URL in the store
      const updatedTabs = tabs.map(tab => 
        tab.id === activeTab ? { ...tab, url: newUrl, title: 'Loading...' } : tab
      );
      useTabStore.setState({ tabs: updatedTabs });
      
      // Add to history if not in incognito mode
      if (!isIncognito) {
        addHistory(newUrl);
      }
      
      // Update the URL state immediately
      setUrl(newUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = url.trim();
    
    if (!finalUrl) return;
    
    // Add protocol if missing
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      // Check if it looks like a domain
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = `https://${finalUrl}`;
      } else {
        // Search query
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`;
      }
    }
    
    handleNavigate(finalUrl);
  };

  const handleBack = () => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.history.back();
    }
  };

  const handleForward = () => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.history.forward();
    }
  };

  const handleRefresh = () => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.src) {
      iframe.src = iframe.src;
    }
  };

  const handleHome = () => {
    handleNavigate('https://reversesearch.co.in');
  };

  return (
    <div className="chrome-address-bar">
      {/* Navigation buttons */}
      <div className="chrome-nav-buttons">
        <button 
          className={`chrome-nav-btn ${!canGoBack ? 'disabled' : ''}`}
          onClick={handleBack}
          disabled={!canGoBack}
          title="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <button 
          className={`chrome-nav-btn ${!canGoForward ? 'disabled' : ''}`}
          onClick={handleForward}
          disabled={!canGoForward}
          title="Forward"
        >
          <ArrowRight size={16} />
        </button>
        <button className="chrome-nav-btn" onClick={handleRefresh} title="Reload">
          <RotateCcw size={16} />
        </button>
        <button className="chrome-nav-btn" onClick={handleHome} title="Home">
          <Home size={16} />
        </button>
      </div>

      {/* Address input */}
      <form onSubmit={handleSubmit} className="chrome-omnibox">
        <div className="chrome-security-indicator">
          <Lock size={12} className="text-chrome-secure" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="chrome-address-input"
          placeholder="Search Google or type a URL"
        />
      </form>

      {/* Action buttons */}
      <div className="chrome-action-buttons">
        <button
          className={`chrome-action-btn ${isIncognito ? 'active' : ''}`}
          onClick={toggleIncognito}
          title={isIncognito ? 'Exit Incognito' : 'New Incognito Window'}
        >
          <Shield size={16} />
        </button>
        <button
          className={`chrome-action-btn ${isZen ? 'active' : ''}`}
          onClick={toggleZen}
          title={isZen ? 'Exit Zen Mode' : 'Zen Mode'}
        >
          <Eye size={16} />
        </button>
        <ChromeMenuDropdown onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default ChromeAddressBar;