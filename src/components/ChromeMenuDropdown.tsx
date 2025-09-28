import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import ChromeMenu from './ChromeMenu';

interface ChromeMenuDropdownProps {
  onNavigate: (view: string) => void;
}

const ChromeMenuDropdown: React.FC<ChromeMenuDropdownProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    console.log('Closing menu'); // Debug log
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    console.log('Click outside detected'); // Debug log
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      closeMenu();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      console.log('Escape key pressed, closing menu'); // Debug log
      closeMenu();
    }
  };

  useEffect(() => {
    if (isOpen) {
      console.log('Menu opened, adding event listeners'); // Debug log
      // Use setTimeout to ensure the click that opened the menu doesn't immediately close it
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
      }, 0);
    }

    return () => {
      console.log('Cleaning up event listeners'); // Debug log
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log('Menu button clicked, isOpen:', isOpen); // Debug log
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        className="chrome-action-btn" 
        onClick={handleButtonClick}
        title="Customize and control"
      >
        <MoreVertical size={16} />
      </button>
      
      {isOpen && (
        <div className="chrome-menu-overlay">
          <ChromeMenu 
            onClose={() => {
              console.log('onClose called from ChromeMenu'); // Debug log
              closeMenu();
            }} 
            onNavigate={(view) => {
              console.log('Navigating to:', view); // Debug log
              onNavigate(view);
              closeMenu(); // Ensure menu closes after navigation
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ChromeMenuDropdown;