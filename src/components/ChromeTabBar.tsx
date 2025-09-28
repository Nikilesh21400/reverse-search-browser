import React, { useState } from 'react';
import { useTabStore } from '../store/tabs';
import { X, Plus } from 'lucide-react';

const ChromeTabBar = () => {
  const { tabs, activeTab, addTab, closeTab, setActiveTab } = useTabStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabId: string } | null>(null);

  const getTabTitle = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain || 'New Tab';
    } catch {
      return 'New Tab';
    }
  };

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tabId });
  };

  const handleNewTab = () => {
    addTab('https://www.google.com');
    setContextMenu(null);
  };

  const handleCloseTab = (tabId: string) => {
    closeTab(tabId);
    setContextMenu(null);
  };

  const handleCloseOthers = (keepTabId: string) => {
    tabs.forEach(tab => {
      if (tab.id !== keepTabId) {
        closeTab(tab.id);
      }
    });
    setContextMenu(null);
  };

  React.useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="chrome-tab-bar">
      <div className="chrome-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`chrome-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            onContextMenu={(e) => handleContextMenu(e, tab.id)}
          >
            <div className="chrome-tab-content">
              <div className="chrome-tab-favicon">
                <div className="w-4 h-4 bg-chrome-favicon rounded-sm"></div>
              </div>
               <span className="chrome-tab-title">
                 {tab.title || getTabTitle(tab.url)}
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
          onClick={() => addTab('https://www.google.com')}
          onContextMenu={(e) => {
            e.preventDefault();
            handleNewTab();
          }}
        >
          <Plus size={16} />
        </button>
      </div>
      
      {/* Context Menu */}
      {contextMenu && (
        <div
          className="chrome-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button onClick={handleNewTab}>New tab</button>
          <button onClick={() => handleCloseTab(contextMenu.tabId)}>Close tab</button>
          <button onClick={() => handleCloseOthers(contextMenu.tabId)}>Close other tabs</button>
        </div>
      )}
    </div>
  );
};

export default ChromeTabBar;