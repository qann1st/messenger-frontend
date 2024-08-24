import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import type { ChatWithPagination, User } from '~/shared';
import { useUserStore } from '~/shared';

import { getRecipientFromUsers } from '../helpers';

export const useHandleOnlineSocket = () => {
  const { user, setUser, socket } = useUserStore();
  const { dialogId } = useParams();
  const queryClient = useQueryClient();

  const emitReadMessages = () => {
    if (dialogId && socket && user) {
      const recipient = getRecipientFromUsers(user.dialogs.find((el) => el.id === dialogId)?.users ?? [], user.id)?.id;
      socket.emit('read-messages', {
        roomId: dialogId,
        recipient,
      });
    }
  };

  const updateDialogUsers = (id: string, isOnline: boolean, lastOnline?: number) => {
    if (!user) {
      return;
    }
    const userDialog = user.dialogs.find((el) => !!el.users.find((u) => u.id === id));

    if (!userDialog) {
      return;
    }

    const updatedUserDialogs = user.dialogs.map((dialog) =>
      dialog.id === userDialog.id
        ? {
            ...dialog,
            users: dialog.users.map((u) => ({
              ...u,
              isOnline,
              ...(lastOnline !== undefined && { lastOnline }),
            })),
          }
        : dialog,
    );

    queryClient.setQueryData(['chat', id], (oldData: ChatWithPagination) => {
      return { ...oldData, users: updatedUserDialogs.find((el) => el.id === id)?.users };
    });

    setUser({ ...user, dialogs: updatedUserDialogs } as User);
  };

  const handleUpdateUser = (updatedUser: User) => {
    if (!user) {
      return;
    }

    const updatedDialogs = user.dialogs.map((dialog) => ({
      ...dialog,
      users: dialog.users.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)),
    }));

    queryClient.setQueryData(['chat', updatedUser.id], (oldData: ChatWithPagination) => {
      return { ...oldData, users: { ...updatedDialogs.find((el) => el.id === updatedUser.id)?.users, ...updatedUser } };
    });

    setUser({ ...user, dialogs: updatedDialogs } as User);
  };

  useEffect(() => {
    emitReadMessages();
  }, [emitReadMessages]);

  useEffect(() => {
    if (!socket || !user) {
      return;
    }

    const handleOnline = ({ userId }: { userId: string }) => updateDialogUsers(userId, true);
    const handleOffline = ({ userId, lastOnline }: { userId: string; lastOnline: number }) =>
      updateDialogUsers(userId, false, lastOnline);
    const handleUserUpdate = (updatedUser: User) => handleUpdateUser(updatedUser);

    socket.on('online', handleOnline);
    socket.on('offline', handleOffline);
    socket.on('update-user', handleUserUpdate);

    return () => {
      socket.off('online', handleOnline);
      socket.off('offline', handleOffline);
      socket.off('update-user', handleUserUpdate);
    };
  }, [socket, user]);
};
