import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import type { ChatWithPagination } from '~/shared';
import { useUserStore } from '~/shared';

import { getRecipientFromUsers } from '../helpers';

export const useHandleOnlineSocket = () => {
  const { user, setUser, socket } = useUserStore();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !user) {
      return;
    }

    socket.on('online', (id: string) => {
      const userDialogs = user.dialogs.find((el) => el.id === id);
      if (!userDialogs) {
        return;
      }

      const userDialog = getRecipientFromUsers(userDialogs.users, id);
      if (!userDialog) {
        return;
      }

      const updatedUserDialogs = user.dialogs.map((dialog) =>
        dialog.id === id
          ? {
              ...dialog,
              users: dialog.users.map((u) => ({ ...u, isOnline: true })),
            }
          : dialog,
      );

      queryClient.setQueryData(['chat', id], (oldData: ChatWithPagination) => {
        return { ...oldData, users: updatedUserDialogs.find((el) => el.id === id)?.users };
      });

      setUser({ ...user, dialogs: updatedUserDialogs });
    });

    socket.on('offline', (id: string, lastOnline: number) => {
      const userDialogs = user.dialogs.find((el) => el.id === id);
      if (!userDialogs) {
        return;
      }

      const userDialog = getRecipientFromUsers(userDialogs.users, id);
      if (!userDialog) {
        return;
      }

      const updatedUserDialogs = user.dialogs.map((dialog) =>
        dialog.id === id
          ? {
              ...dialog,
              users: dialog.users.map((u) => ({ ...u, isOnline: false, lastOnline })),
            }
          : dialog,
      );

      queryClient.setQueryData(['chat', id], (oldData: ChatWithPagination) => {
        return { ...oldData, users: updatedUserDialogs.find((el) => el.id === id)?.users };
      });

      setUser({ ...user, dialogs: updatedUserDialogs });
    });

    return () => {
      socket.off('online');
      socket.off('offline');
    };
  }, [socket]);
};
