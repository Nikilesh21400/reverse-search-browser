import { create } from 'zustand';

interface Tab {
  id: string;
  url: string;
  title?: string;
}

interface TabStore {
  tabs: Tab[];
  activeTab: string;
  addTab: (url: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  tabs: [ { id: '1', url: 'https://reversesearch.co.in', title: 'ReverseSearch' } ],
  activeTab: '1',
  addTab: (url) => set((state) => {
    const id = Date.now().toString();
    return {
      tabs: [...state.tabs, { id, url, title: 'New Tab' }],
      activeTab: id
    };
  }),
  closeTab: (id) => set((state) => {
    const newTabs = state.tabs.filter((t) => t.id !== id);
    const newActive = state.activeTab === id && newTabs.length ? newTabs[0].id : state.activeTab;
    return {
      tabs: newTabs,
      activeTab: newActive
    };
  }),
  setActiveTab: (id) => set(() => ({ activeTab: id }))
}));