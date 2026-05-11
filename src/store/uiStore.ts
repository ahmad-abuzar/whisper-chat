import { create } from 'zustand';

type Tab = 'chats' | 'contacts' | 'profile';

interface UIStore {
  activeTab: Tab;
  sidebarOpen: boolean;
  searchQuery: string;
  setActiveTab: (tab: Tab) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeTab: 'chats',
  sidebarOpen: true,
  searchQuery: '',
  setActiveTab: (activeTab) => set({ activeTab }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
