import React, { useState } from 'react';
import { useIncognitoStore } from '../store/incognito';

const Bookmarks = () => {
  const { isIncognito } = useIncognitoStore();
  const [bookmarks, setBookmarks] = useState<string[]>(
    JSON.parse(localStorage.getItem('bookmarks') || '[]')
  );

  const addBookmark = () => {
    if (isIncognito) return alert('Bookmarks are disabled in incognito mode.');
    const url = prompt('Enter URL to bookmark:');
    if (url) {
      const updated = [...bookmarks, url];
      setBookmarks(updated);
      localStorage.setItem('bookmarks', JSON.stringify(updated));
    }
  };

  const remove = (url: string) => {
    if (isIncognito) return alert('Bookmarks are disabled in incognito mode.');
    const updated = bookmarks.filter((b) => b !== url);
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Bookmarks</h2>
      <button onClick={addBookmark} className="bg-blue-500 text-white px-3 py-1 rounded">+ Add</button>
      <ul className="mt-4">
        {bookmarks.map((url) => (
          <li key={url} className="flex justify-between py-1 border-b">
            <a href={url} target="_blank" rel="noreferrer">{url}</a>
            <button onClick={() => remove(url)} className="text-red-500">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bookmarks;
