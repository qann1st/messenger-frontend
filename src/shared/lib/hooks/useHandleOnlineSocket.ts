import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import type { ChatWithPagination, User } from '~/shared';
import { useUserStore } from '~/shared';

import { getRecipientFromUsers } from '../helpers';

export const useHandleOnlineSocket = () => {
  const { user, setUser, socket } = useUserStore();
  const { dialogId } = useParams();
  const queryClient = useQueryClient();

  const emitReadMessages = useCallback(() => {
    if (dialogId && socket && user) {
      const recipient = getRecipientFromUsers(user.dialogs.find((el) => el.id === dialogId)?.users ?? [], user.id)?.id;
      socket.emit('read-messages', {
        roomId: dialogId,
        recipient,
      });
    }
  }, [dialogId, socket, user]);

  const updateDialogUsers = useCallback(
    (id: string, isOnline: boolean, lastOnline?: number) => {
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
    },
    [user, queryClient, setUser],
  );

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

    socket.on('online', handleOnline);
    socket.on('offline', handleOffline);

    return () => {
      socket.off('online', handleOnline);
      socket.off('offline', handleOffline);
    };
  }, [socket, user, updateDialogUsers]);
};
