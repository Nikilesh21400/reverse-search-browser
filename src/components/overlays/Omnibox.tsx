import React, { useEffect, useState } from 'react';
import { useHistoryStore } from '../../store/history';
import { useIncognitoStore } from '../../store/incognito';

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
    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border shadow-xl rounded p-4 w-96 z-50">
      <input
        autoFocus
        placeholder="Search bookmarks, history, or enter URL..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <ul className="mt-2 max-h-60 overflow-auto text-sm">
        {results.map((item, idx) => (
          <li key={idx} className="p-2 border-b hover:bg-gray-100 cursor-pointer">
            <span className="font-bold text-gray-600">{item.type}:</span> {item.value}
          </li>
        ))}
        {results.length === 0 && (
          <li className="p-2 text-gray-400">No results</li>
        )}
      </ul>
    </div>
  );
};

export default Omnibox;
