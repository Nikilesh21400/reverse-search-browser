import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import ChromeMenu from './ChromeMenu';

interface ChromeMenuDropdownProps {
  onNavigate: (view: string) => void;
}

const ChromeMenuDropdown: React.FC<ChromeMenuDropdownProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        className="chrome-action-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Customize and control"
      >
        <MoreVertical size={16} />
      </button>
      
      {isOpen && (
        <div className="chrome-menu-overlay">
          <ChromeMenu 
            onClose={() => setIsOpen(false)} 
            onNavigate={onNavigate}
          />
        </div>
      )}
    </div>
  );
};

export default ChromeMenuDropdown;