import { create } from 'zustand';

interface UIState {
  isDark: boolean;
  toggleTheme: () => void;
  initializeTheme: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
}

// Initialize theme from localStorage BEFORE creating store
const savedTheme = localStorage.getItem('theme');
const initialIsDark = savedTheme === 'dark';

// Apply theme immediately to prevent flash
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
} else {
  // Set default theme if none exists
  const defaultTheme = 'light';
  document.documentElement.setAttribute('data-theme', defaultTheme);
  localStorage.setItem('theme', defaultTheme);
}

export const useUIStore = create<UIState>((set) => ({
  isDark: initialIsDark,
  
  toggleTheme: () => set((state) => {
    const newMode = !state.isDark;
    const themeString = newMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeString);
    localStorage.setItem('theme', themeString);
    
    return { isDark: newMode };
  }),

  initializeTheme: () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  },

  // Sidebar methods
  isSidebarCollapsed: false,
  
  toggleSidebar: () => set((state) => ({ 
    isSidebarCollapsed: !state.isSidebarCollapsed 
  })),
  
  collapseSidebar: () => set({ isSidebarCollapsed: true }),
  expandSidebar: () => set({ isSidebarCollapsed: false }),
}));