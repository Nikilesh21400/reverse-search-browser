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
    await invoke('add_history_entry', { url });
    set((state) => ({
      history: [{ url, timestamp: Date.now() }, ...state.history]
    }));
  },
  loadHistory: async () => {
    const result = await invoke<HistoryEntry[]>('get_history');
    set({ history: result });
  }
}));
