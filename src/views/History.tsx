import React, { useEffect } from 'react';
import { useHistoryStore } from '../store/history';
import { useTabStore } from '../store/tabs';
import { ArrowLeft, Clock, X, Globe, Trash2 } from 'lucide-react';

const History = () => {
  const { history, loadHistory, removeHistory } = useHistoryStore();
  const { addTab } = useTabStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const openInNewTab = (url: string) => {
    addTab(url);
  };

  const removeItem = (index: number) => {
    removeHistory(index);
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
        <h1 className="chrome-page-title">History</h1>
      </div>
      
      <div className="chrome-page-content">
        {history.length === 0 ? (
          <div className="chrome-empty-state">
            <Clock size={48} className="chrome-empty-icon" />
            <h2>No history yet</h2>
            <p>Pages you visit will appear here</p>
          </div>
        ) : (
          <div className="chrome-history-list">
            {history.map((item, index) => (
              <div key={index} className="chrome-history-item">
                <div className="chrome-history-favicon">
                  <Globe size={16} className="text-chrome-text-secondary" />
                </div>
                <div className="chrome-history-info">
                  <div className="chrome-history-title">{getHostname(item.url)}</div>
                  <div className="chrome-history-url">{item.url}</div>
                  <div className="chrome-history-time">{formatDate(item.timestamp)}</div>
                </div>
                <div className="chrome-history-actions">
                  <button
                    className="chrome-history-action"
                    onClick={() => openInNewTab(item.url)}
                    title="Open in new tab"
                  >
                    Open
                  </button>
                  <button
                    className="chrome-history-remove"
                    onClick={() => removeItem(index)}
                    title="Remove from history"
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

export default History;