import { useEffect } from 'react';
import { useZenStore } from '../store/zen';

export const useZenEscape = () => {
  const { isZen, toggleZen } = useZenStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isZen) {
        toggleZen();
      }
    };

    if (isZen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZen, toggleZen]);
};