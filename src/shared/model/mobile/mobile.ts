import { create } from 'zustand';

import { TMobileState } from './mobile.types';

export const useMobileStore = create<TMobileState>((set) => ({
  type: window.matchMedia('(max-width: 600px)').matches
    ? 'mobile'
    : window.matchMedia('(max-width: 992px)').matches
      ? 'tablet'
      : 'desktop',
  lastChat: '',
  setType: (value: TMobileState['type']) => set({ type: value }),
  setLastChat: (value: string) => set({ lastChat: value }),
}));
