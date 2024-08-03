import type { Socket } from 'socket.io-client';

import type { User } from '~/shared';

export type TUserState = {
  user: User | null;
  setUser: (user: User) => void;
  getUser: () => TUserState['user'];
  fetchUser: () => Promise<void>;
  fetching: boolean;
  error: string | null;
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
};
