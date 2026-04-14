import { create } from 'zustand';

interface AppState {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  // This store can be expanded later to hold user states, auth, and transformations data!
}

export const useAppStore = create<AppState>((set) => ({
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
}));
