import React, { useEffect, useState } from 'react';
import { Store } from "@tauri-apps/plugin-store";



const Settings = () => {
  const [homepage, setHomepage] = useState('');
  const [searchEngine, setSearchEngine] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    (async () => {
      const s = await Store.load(".settings.dat");
      setStore(s);

      setHomepage((await store.get('homepage')) as string || 'https://reversesearch.co.in');
      setSearchEngine((await store.get('searchEngine')) as string || 'https://reversesearch.co.in/search?q=');
      setTheme((await store.get('theme')) as 'light' | 'dark' || 'light');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    })();
  }, []);

  const saveSettings = async () => {
    await store.set('homepage', homepage);
    await store.set('searchEngine', searchEngine);
    await store.set('theme', theme);
    await store.save();
    document.documentElement.classList.toggle('dark', theme === 'dark');
    alert('Settings saved!');
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Settings</h2>
      <div>
        <label className="block font-semibold">Homepage URL</label>
        <input value={homepage} onChange={(e) => setHomepage(e.target.value)} className="border px-2 py-1 w-full" />
      </div>
      <div>
        <label className="block font-semibold">Search Engine</label>
        <select
          value={searchEngine}
          onChange={(e) => setSearchEngine(e.target.value)}
          className="border px-2 py-1 w-full"
        >
          <option value="https://reversesearch.co.in/search?q=">ReverseSearch</option>
          <option value="https://www.google.com/search?q=">Google</option>
          <option value="https://www.bing.com/search?q=">Bing</option>
        </select>
      </div>
      <div>
        <label className="block font-semibold">Theme</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')} className="border px-2 py-1">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button onClick={saveSettings} className="bg-blue-600 text-white px-4 py-1 rounded">Save</button>
    </div>
  );
};

export default Settings;
