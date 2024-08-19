import type { Socket } from 'socket.io-client';

import type { User } from '~/shared';

export type TUserState = {
  user: User | null;
  setUser: (user: TUserState['user']) => void;
  getUser: () => TUserState['user'];
  fetchUser: () => Promise<void>;
  fetching: boolean;
  error: string | null;
  socket: Socket | null;
  setSocket: (socket: TUserState['socket']) => void;
};
