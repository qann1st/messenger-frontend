import { create } from 'zustand';

import { messengerApi } from '~/shared';

import { TUserState } from './user.types';

export const useUserStore = create<TUserState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  getUser: () => get().user,
  fetchUser: async () => {
    set({ fetching: true });
    await messengerApi
      .getUserMe()
      .then((user) => set({ user }))
      .catch((error) => set({ error }))
      .finally(() => set({ fetching: false }));
  },
  fetching: true,
  error: null,
  socket: null,
  setSocket: (socket) => set({ socket }),
}));
