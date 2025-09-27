import React, { useState } from 'react';
import { useTabStore } from '../store/tabs';
import { useNavigate } from 'react-router-dom';
import { useIncognitoStore } from '../store/incognito';
import { useZenStore } from '../store/zen';
import ShortcutsHelp from './ShortcutsHelp';

const NavBar = () => {
  const { tabs, activeTab, addTab } = useTabStore();
  const { isIncognito, toggleIncognito } = useIncognitoStore();
  const { isZen, toggleZen } = useZenStore();
  const [url, setUrl] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className={`p-2 flex items-center gap-2 flex-wrap ${isZen ? 'hidden' : 'bg-gray-100 dark:bg-gray-800'}`}>
        <div className="w-full text-sm text-red-600 dark:text-red-300" hidden={!isIncognito}>
          🔒 You are browsing in Incognito Mode — history/bookmarks disabled.
        </div>
        <button onClick={() => navigate(-1)}>←</button>
        <button onClick={() => navigate(1)}>→</button>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTab(url);
          }}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Enter URL..."
        />
        <button onClick={() => addTab(url)}>New Tab</button>
        <button onClick={toggleIncognito} className="bg-black text-white px-2 py-1 rounded text-xs">
          {isIncognito ? 'Exit Incognito' : 'Incognito'}
        </button>
        <button onClick={toggleZen} className="bg-indigo-600 text-white px-2 py-1 rounded text-xs">
          {isZen ? 'Exit Zen' : 'Zen Mode'}
        </button>
        <button onClick={() => setShowShortcuts(true)} className="bg-gray-700 text-white px-2 py-1 rounded text-xs">
          ?
        </button>
      </div>
      {showShortcuts && <ShortcutsHelp onClose={() => setShowShortcuts(false)} />}
    </>
  );
};

export default NavBar;
