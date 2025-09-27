import React, { useState } from 'react';
import ChromeTabBar from './ChromeTabBar';
import ChromeAddressBar from './ChromeAddressBar';
import Omnibox from './overlays/Omnibox';
import { useZenStore } from '../store/zen';
import { useIncognitoStore } from '../store/incognito';

// Import views
import Settings from '../views/Settings';
import History from '../views/History';
import Downloads from '../views/Downloads';
import Bookmarks from '../views/Bookmarks';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isZen } = useZenStore();
  const { isIncognito } = useIncognitoStore();
  const [currentView, setCurrentView] = useState('home');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'settings':
        return <Settings />;
      case 'history':
        return <History />;
      case 'downloads':
        return <Downloads />;
      case 'bookmarks':
        return <Bookmarks />;
      default:
        return children;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-chrome-bg">
      {/* Incognito Mode Indicator */}
      {isIncognito && (
        <div className="bg-gray-800 text-white text-center py-2 text-sm">
          🕵️ You're browsing in incognito mode - Your activity won't be saved
        </div>
      )}
      
      {/* Chrome-like interface - hidden in zen mode */}
      {!isZen && (
        <>
          <ChromeTabBar />
          <ChromeAddressBar onNavigate={handleNavigate} />
        </>
      )}
      
      {/* Content area */}
      <div className="flex-1 overflow-hidden">{renderView()}</div>
      
      {/* Overlays */}
      <Omnibox />
    </div>
  );
};

export default Layout;