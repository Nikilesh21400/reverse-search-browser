import React from 'react';
import { useTabStore } from '../store/tabs';
import { X, Plus } from 'lucide-react';

const ChromeTabBar = () => {
  const { tabs, activeTab, addTab, closeTab, setActiveTab } = useTabStore();

  const getTabTitle = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain || 'New Tab';
    } catch {
      return 'New Tab';
    }
  };

  return (
    <div className="chrome-tab-bar">
      <div className="chrome-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`chrome-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="chrome-tab-content">
              <div className="chrome-tab-favicon">
                <div className="w-4 h-4 bg-chrome-favicon rounded-sm"></div>
              </div>
              <span className="chrome-tab-title">
                {getTabTitle(tab.url)}
              </span>
              <button
                className="chrome-tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
        <button
          className="chrome-new-tab-btn"
          onClick={() => addTab('https://reversesearch.co.in')}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChromeTabBar;