import React, { useState, useEffect } from 'react';
import { useIncognitoStore } from '../store/incognito';
import { useTabStore } from '../store/tabs';
import { 
  ArrowLeft, 
  Star, 
  Plus, 
  X, 
  MoreVertical, 
  Edit3,
  Trash2,
  Globe
} from 'lucide-react';

interface Bookmark {
  id: string;
  name: string;
  url: string;
  timestamp: number;
}

const Bookmarks = () => {
  const { isIncognito } = useIncognitoStore();
  const { addTab } = useTabStore();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBookmark, setNewBookmark] = useState({ name: '', url: '' });

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const saved = localStorage.getItem('chrome_bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  };

  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    localStorage.setItem('chrome_bookmarks', JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
  };

  const addBookmark = () => {
    if (isIncognito) {
      alert('Bookmarks are disabled in incognito mode.');
      return;
    }

    if (!newBookmark.name.trim() || !newBookmark.url.trim()) return;

    let finalUrl = newBookmark.url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    const bookmark: Bookmark = {
      id: Date.now().toString(),
      name: newBookmark.name.trim(),
      url: finalUrl,
      timestamp: Date.now()
    };

    const updated = [bookmark, ...bookmarks];
    saveBookmarks(updated);
    setNewBookmark({ name: '', url: '' });
    setShowAddForm(false);
  };

  const removeBookmark = (id: string) => {
    if (isIncognito) {
      alert('Bookmarks are disabled in incognito mode.');
      return;
    }
    
    const updated = bookmarks.filter(b => b.id !== id);
    saveBookmarks(updated);
  };

  const openBookmark = (url: string) => {
    addTab(url);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="chrome-page">
      <div className="chrome-page-header">
        <button 
          className="chrome-back-btn"
          onClick={() => window.history.back()}
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="chrome-page-title">Bookmarks</h1>
        <div className="flex-1" />
        <button
          className="chrome-action-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={isIncognito}
          title="Add bookmark"
        >
          <Plus size={20} />
        </button>
      </div>
      
      {showAddForm && (
        <div className="chrome-bookmark-form">
          <div className="chrome-form-group">
            <label>Name:</label>
            <input
              type="text"
              value={newBookmark.name}
              onChange={(e) => setNewBookmark({...newBookmark, name: e.target.value})}
              placeholder="Bookmark name"
              className="chrome-form-input"
            />
          </div>
          <div className="chrome-form-group">
            <label>URL:</label>
            <input
              type="text"
              value={newBookmark.url}
              onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
              placeholder="https://example.com"
              className="chrome-form-input"
            />
          </div>
          <div className="chrome-form-actions">
            <button onClick={addBookmark} className="chrome-btn-primary">
              Add Bookmark
            </button>
            <button onClick={() => setShowAddForm(false)} className="chrome-btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="chrome-page-content">
        {bookmarks.length === 0 ? (
          <div className="chrome-empty-state">
            <Star size={48} className="chrome-empty-icon" />
            <h2>No bookmarks yet</h2>
            <p>Click the + button to add your first bookmark</p>
          </div>
        ) : (
          <div className="chrome-bookmarks-grid">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="chrome-bookmark-card">
                <div className="chrome-bookmark-favicon">
                  <Globe size={16} className="text-chrome-text-secondary" />
                </div>
                <div className="chrome-bookmark-info">
                  <div className="chrome-bookmark-name">{bookmark.name}</div>
                  <div className="chrome-bookmark-url">{bookmark.url}</div>
                  <div className="chrome-bookmark-date">Added {formatDate(bookmark.timestamp)}</div>
                </div>
                <div className="chrome-bookmark-actions">
                  <button
                    className="chrome-bookmark-action"
                    onClick={() => openBookmark(bookmark.url)}
                    title="Open in new tab"
                  >
                    Open
                  </button>
                  <button
                    className="chrome-bookmark-action chrome-bookmark-remove"
                    onClick={() => removeBookmark(bookmark.id)}
                    title="Remove bookmark"
                    disabled={isIncognito}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;