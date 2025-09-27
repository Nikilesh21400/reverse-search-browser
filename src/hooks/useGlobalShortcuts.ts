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
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        addTab('https://reversesearch.co.in');
      }

      if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        closeTab(activeTab);
      }

      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.src) {
          iframe.src = iframe.src;
        }
      }

      if (e.ctrlKey && !isNaN(parseInt(e.key))) {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (tabs[index]) setActiveTab(tabs[index].id);
      }

      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        toggleZen();
      }

      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        toggleIncognito();
      }

      if (e.key === 'Escape') {
        const anyOpen = document.querySelector('.z-50');
        if (anyOpen) anyOpen.remove();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [tabs, activeTab]);
};
