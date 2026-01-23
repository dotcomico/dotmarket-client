import { create } from 'zustand';

interface UIState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDark: localStorage.getItem('theme') === 'dark',
  
  toggleTheme: () => set((state) => {
    const newMode = !state.isDark;
    const themeString = newMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeString);
    localStorage.setItem('theme', themeString);
    
    return { isDark: newMode };
  }),
}));