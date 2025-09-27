import React from 'react';
import ChromeTabBar from './ChromeTabBar';
import ChromeAddressBar from './ChromeAddressBar';
import Omnibox from './overlays/Omnibox';
import { useZenStore } from '../store/zen';
import { useIncognitoStore } from '../store/incognito';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isZen } = useZenStore();
  const { isIncognito } = useIncognitoStore();

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
          <ChromeAddressBar />
        </>
      )}
      
      {/* Content area */}
      <div className="flex-1 overflow-hidden">{children}</div>
      
      {/* Overlays */}
      <Omnibox />
    </div>
  );
};

export default Layout;