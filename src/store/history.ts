import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { useIncognitoStore } from './incognito';

interface HistoryEntry {
  url: string;
  timestamp: number;
}

interface HistoryStore {
  history: HistoryEntry[];
  addHistory: (url: string) => void;
  loadHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],
  addHistory: async (url) => {
    const { isIncognito } = useIncognitoStore.getState();
    if (isIncognito) return;
    
    try {
      await invoke('add_history_entry', { url });
      set((state) => ({
        history: [{ url, timestamp: Date.now() }, ...state.history]
      }));
    } catch (error) {
      // Fallback for web preview - just add to memory
      console.warn('Tauri not available, using memory storage:', error);
      set((state) => ({
        history: [{ url, timestamp: Date.now() }, ...state.history]
      }));
    }
  },
  loadHistory: async () => {
    try {
      const result = await invoke<HistoryEntry[]>('get_history');
      set({ history: result });
    } catch (error) {
      // Fallback for web preview
      console.warn('Tauri not available, no history loaded:', error);
    }
  }
}));
