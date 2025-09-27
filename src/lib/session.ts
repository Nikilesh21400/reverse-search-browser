import { create } from 'zustand';

interface SessionState {
  tabs: { id: string; url: string }[];
  setTabs: (tabs: { id: string; url: string }[]) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  tabs: [],
  setTabs: (tabs) => set(() => ({ tabs }))
}));
