import { useEffect } from 'react';
import { useTabStore } from '../store/tabs';
import { useZenStore } from '../store/zen';
import { useIncognitoStore } from '../store/incognito';

export const useGlobalShortcuts = () => {
  const { tabs, activeTab, addTab, closeTab, setActiveTab } = useTabStore();
  const { toggleZen } = useZenStore();
  const { toggleIncognito } = useIncognitoStore();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Ctrl+T - New tab
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        addTab('https://reversesearch.co.in');
      }

      // Ctrl+W - Close tab
      if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        if (tabs.length > 1) {
          closeTab(activeTab);
        }
      }

      // Ctrl+R - Refresh
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.src) {
          iframe.src = iframe.src;
        }
      }

      // Ctrl+1-9 - Switch tabs
      if (e.ctrlKey && !isNaN(parseInt(e.key)) && parseInt(e.key) > 0) {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (tabs[index]) setActiveTab(tabs[index].id);
      }

      // Ctrl+Z - Toggle zen mode
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        toggleZen();
      }

      // Ctrl+Shift+N - Toggle incognito
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        toggleIncognito();
      }

      // Ctrl+L - Focus address bar
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        const addressInput = document.querySelector('.chrome-address-input') as HTMLInputElement;
        if (addressInput) {
          addressInput.focus();
          addressInput.select();
        }
      }

      // Escape - Close any overlays
      if (e.key === 'Escape') {
        const anyOpen = document.querySelector('.z-50');
        if (anyOpen) anyOpen.remove();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [tabs, activeTab, addTab, closeTab, setActiveTab, toggleZen, toggleIncognito]);
};
