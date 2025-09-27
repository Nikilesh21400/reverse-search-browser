import React, { useEffect, useState } from 'react';
import { useTabStore } from '../store/tabs';
import { Store } from "@tauri-apps/plugin-store";



const Home = () => {
  const { tabs, activeTab } = useTabStore();
  const [defaultURL, setDefaultURL] = useState('https://reversesearch.co.in');

  useEffect(() => {
    (async () => {
      const store = await Store.load(".settings.dat");
      const homepage = (await store.get('homepage')) as string;
      setDefaultURL(homepage || 'https://reversesearch.co.in');
    })();
  }, []);

  const active = tabs.find((t) => t.id === activeTab);

  return (
    <iframe
      title="webview"
      src={active?.url || defaultURL}
      className="w-full h-full border-none"
    />
  );
};

export default Home;
