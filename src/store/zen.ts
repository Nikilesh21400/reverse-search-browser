import { create } from 'zustand';

interface ZenModeState {
  isZen: boolean;
  toggleZen: () => void;
}

export const useZenStore = create<ZenModeState>((set) => ({
  isZen: false,
  toggleZen: () => set((state) => ({ isZen: !state.isZen }))
}));
