import React, { useEffect, useState } from 'react';
import { useTabStore } from '../store/tabs';
import { useHistoryStore } from '../store/history';
import { Store } from "@tauri-apps/plugin-store";

const Home = () => {
  const { tabs, activeTab } = useTabStore();
  const { addHistory } = useHistoryStore();
  const [defaultURL, setDefaultURL] = useState('https://reversesearch.co.in');

  useEffect(() => {
    (async () => {
      const store = await Store.load(".settings.dat");
      const homepage = (await store.get('homepage')) as string;
      setDefaultURL(homepage || 'https://reversesearch.co.in');
    })();
  }, []);

  const active = tabs.find((t) => t.id === activeTab);
  const currentUrl = active?.url || defaultURL;

  // Add to history when URL changes (except in incognito mode)
  useEffect(() => {
    if (currentUrl && currentUrl !== 'about:blank') {
      addHistory(currentUrl);
    }
  }, [currentUrl, addHistory]);

  return (
    <iframe
      title="webview"
      src={currentUrl}
      className="w-full h-full border-none bg-white"
      onLoad={(e) => {
        // Update tab title based on loaded page
        const iframe = e.target as HTMLIFrameElement;
        try {
          const title = iframe.contentDocument?.title;
          if (title && active) {
            // Could update tab title here if we want
          }
        } catch (error) {
          // Cross-origin restrictions
        }
      }}
    />
  );
};

export default Home;
