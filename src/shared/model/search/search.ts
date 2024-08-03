import { create } from 'zustand';

import { messengerApi } from '~/shared';

import { TSearchState } from './search.types';

export const useSearchStore = create<TSearchState>((set) => ({
  searchDialogs: [],
  isSearch: false,
  fetching: false,
  inputValue: '',
  fetchUsers: async (search: string) => {
    set({ fetching: true });
    const { data } = await messengerApi.getUsersBySearch({ limit: 10000, page: 1, search });
    set({ searchDialogs: data, isSearch: true, fetching: false });
  },
  clearDialogs: () => {
    set({ searchDialogs: [] });
  },
  setIsSearch: (isSearch: boolean) => set({ isSearch }),
  setInputValue: (inputValue: string) => set({ inputValue }),
}));
