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

  const handleNewIncognitoWindow = async () => {
    try {
      // Try to open a new Tauri window
      const { WebviewWindow } = await import('@tauri-apps/api/window');
      
      new WebviewWindow('incognito', {
        url: '/',
        title: 'Incognito Browser',
        width: 1200,
        height: 800,
        resizable: true,
        fullscreen: false,
        decorations: true,
      });
      
      // Set incognito mode for the new window context
      toggleIncognito();
      
    } catch (error) {
      // Fallback for web or if Tauri is not available
      console.log('Opening incognito in same window (Tauri not available)');
      toggleIncognito();
      alert('Incognito mode activated! (New window requires desktop app)');
    }
    
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