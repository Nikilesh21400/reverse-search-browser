import React, { useEffect, useState } from 'react';
import { useHistoryStore } from '../../store/history';
import { useIncognitoStore } from '../../store/incognito';
import { Search } from 'lucide-react';

const Omnibox = () => {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState('');
  const { history } = useHistoryStore();
  const { isIncognito } = useIncognitoStore();

  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]') as string[];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShow((s) => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!show) return null;

  const results = [
    ...(!isIncognito ? history : []).map((h) => ({ type: 'History', value: h.url })),
    ...(!isIncognito ? bookmarks : []).map((b) => ({ type: 'Bookmark', value: b })),
  ].filter((item) => item.value.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 border border-chrome-border shadow-chrome rounded-lg w-full max-w-2xl mx-4">
        <div className="flex items-center p-4 border-b border-chrome-border">
          <Search size={20} className="text-chrome-text-secondary mr-3" />
          <input
            autoFocus
            placeholder="Search bookmarks, history, or enter URL..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-chrome-text placeholder-chrome-text-secondary text-lg"
          />
        </div>
        <div className="max-h-96 overflow-auto">
          {results.length > 0 ? (
            results.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center p-3 hover:bg-chrome-tab-hover cursor-pointer border-b border-chrome-border last:border-b-0"
                onClick={() => {
                  // Navigate to the selected URL
                  window.location.href = item.value;
                  setShow(false);
                }}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-chrome-favicon rounded mr-3 flex items-center justify-center">
                  <span className="text-xs text-chrome-text-secondary">
                    {item.type === 'History' ? '🕒' : '⭐'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-chrome-text truncate">
                    {item.value}
                  </div>
                  <div className="text-xs text-chrome-text-secondary">
                    {item.type}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-chrome-text-secondary">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p>No results found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Omnibox;
