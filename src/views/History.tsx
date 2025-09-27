import React, { useEffect } from 'react';
import { useHistoryStore } from '../store/history';
import { ArrowLeft, Clock, X } from 'lucide-react';

const History = () => {
  const { history, loadHistory } = useHistoryStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
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
                <div className="chrome-history-info">
                  <div className="chrome-history-url">{item.url}</div>
                  <div className="chrome-history-time">{formatDate(item.timestamp)}</div>
                </div>
                <button className="chrome-history-remove" title="Remove from history">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;