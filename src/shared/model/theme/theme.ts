import { create } from 'zustand';

import { TThemeState } from './theme.types';

export const useThemeStore = create<TThemeState>((set, get) => ({
  theme:
    (localStorage.getItem('theme') as TThemeState['theme']) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches && 'dark') ||
    'light',
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    set({ theme: newTheme });
    return newTheme;
  },
}));
