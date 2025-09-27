import React, { useState } from 'react';
import { useIncognitoStore } from '../store/incognito';
import { useZenStore } from '../store/zen';
import { 
  Settings, 
  History, 
  Shield, 
  Download, 
  Bookmark, 
  Eye,
  X,
  Plus
} from 'lucide-react';

interface ChromeMenuProps {
  onClose: () => void;
  onNavigate: (view: string) => void;
}

const ChromeMenu: React.FC<ChromeMenuProps> = ({ onClose, onNavigate }) => {
  const { toggleIncognito } = useIncognitoStore();
  const { toggleZen } = useZenStore();

  const handleNewIncognitoWindow = () => {
    // In a real Chrome implementation, this would open a new window
    // For now, we'll toggle incognito mode and notify user
    toggleIncognito();
    alert('New incognito window opened! (In a desktop app, this would open a new window)');
    onClose();
  };

  const menuItems = [
    {
      icon: Shield,
      label: 'New incognito window',
      shortcut: 'Ctrl+Shift+N',
      onClick: handleNewIncognitoWindow
    },
    {
      icon: History,
      label: 'History',
      shortcut: 'Ctrl+H',
      onClick: () => {
        onNavigate('history');
        onClose();
      }
    },
    {
      icon: Download,
      label: 'Downloads',
      shortcut: 'Ctrl+J',
      onClick: () => {
        onNavigate('downloads');
        onClose();
      }
    },
    {
      icon: Bookmark,
      label: 'Bookmarks',
      shortcut: 'Ctrl+Shift+O',
      onClick: () => {
        onNavigate('bookmarks');
        onClose();
      }
    },
    {
      icon: Eye,
      label: 'Toggle Zen Mode',
      shortcut: 'Ctrl+Z',
      onClick: () => {
        toggleZen();
        onClose();
      }
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => {
        onNavigate('settings');
        onClose();
      }
    }
  ];

  return (
    <div className="chrome-menu">
      <div className="chrome-menu-content">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="chrome-menu-item"
            onClick={item.onClick}
          >
            <item.icon size={16} className="chrome-menu-icon" />
            <span className="chrome-menu-label">{item.label}</span>
            {item.shortcut && (
              <span className="chrome-menu-shortcut">{item.shortcut}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChromeMenu;