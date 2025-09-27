import { create } from 'zustand';

interface IncognitoState {
  isIncognito: boolean;
  toggleIncognito: () => void;
}

export const useIncognitoStore = create<IncognitoState>((set) => ({
  isIncognito: false,
  toggleIncognito: () => set((state) => ({ isIncognito: !state.isIncognito }))
}));
