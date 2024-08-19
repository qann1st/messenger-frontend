import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { useMessageStore } from '~/entities';
import { type Chat, type ChatWithPagination, Message, User, getRecipientFromUsers, useUserStore } from '~/shared';

import { TSettings } from '../types';
import { useLocalStorage } from './useLocalStorage';

export const useHandleMessageSocket = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [settings] = useLocalStorage<TSettings>('settings', { isSoundNotifications: true });

  const { socket, getUser, setUser } = useUserStore();
  const { getReplyMessage, setIsVisibleReplyMessage } = useMessageStore();

  const handleMessage = (message: Message) => {
    const user = getUser();
    if (message.sender.id === user?.id) {
      queryClient.setQueryData(['chat', message.chatId], (oldData: ChatWithPagination) => {
        const messageDate = new Date(message.createdAt).toDateString();
        const updatedMessages = oldData.groupedMessages[messageDate].map((msg) =>
          msg.id === message.id ? { ...msg, status: 'success' } : msg,
        );

        return {
          ...oldData,
          groupedMessages: {
            ...oldData.groupedMessages,
            [messageDate]: updatedMessages,
          },
        };
      });
      return;
    }

    queryClient.setQueryData(['chat', message.chatId], (oldData: ChatWithPagination) => {
      if (
        !user ||
        (!message.voiceMessage && !message.content && !message.images.length && !message.forwardedMessage.chatId)
      ) {
        return;
      }

      const dialogIndex = user.dialogs.findIndex((d) => d.id === message.chatId);
      const dialog = user.dialogs[dialogIndex];

      const dialogId = window.location.pathname.split('/')[1];

      if (dialogId === message.chatId) {
        socket?.emit('read-messages', {
          roomId: dialogId,
          recipient: getRecipientFromUsers(dialog?.users ?? [], user.id)?.id,
        });
      } else {
        const audio = new Audio('/assets/notification-sound.mp3');

        if (document.hidden && settings?.isSoundNotifications) {
          audio.play().catch((error) => {
            console.error('Failed to play sound:', error);
          });
        }
      }

      if (dialog) {
        dialog.messages = [message];

        if (message.sender.id !== user.id && dialogId !== message.chatId) {
          dialog.unreadedMessages += 1;
        }

        user.dialogs.splice(dialogIndex, 1);

        user.dialogs.unshift(dialog);
      } else {
        user.dialogs.unshift({
          id: message.chatId,
          messages: [message],
          users: [message.sender, user],
        } as Chat);
      }

      setUser(user);

      let groupedMessages = oldData?.groupedMessages ?? {};
      const date = new Date(message.createdAt).toDateString();
      const arr = groupedMessages[date];

      if (!arr) {
        groupedMessages = { [date]: [message], ...groupedMessages };
      } else {
        arr.unshift(message);
      }

      if (oldData.total > oldData.data?.length) {
        oldData.data.pop();
      }

      return {
        ...oldData,
        data: [message, ...(oldData?.data ?? [])],
        total: (oldData?.total ?? 0) + 1,
        groupedMessages,
      };
    });
  };

  const handleDeleteMessage = (message: Message) => {
    const user = getUser();
    if (message.sender.id === user?.id) {
      return;
    }

    queryClient.setQueryData(['chat', message.chatId], (oldData: ChatWithPagination) => {
      if (!user) {
        return oldData;
      }

      const messageDate = new Date(message.createdAt).toDateString();

      const groupedMessages = {
        ...oldData?.groupedMessages,
        [messageDate]: oldData?.groupedMessages[messageDate]?.filter((msg) => msg.id !== message.id),
      };

      const dialog = user.dialogs.find((d) => d.id === message.chatId);

      if (dialog) {
        dialog.messages = [oldData.data[1]];
      }

      if (getReplyMessage()?.id === message.id) {
        setIsVisibleReplyMessage(false);
      }

      setUser(user);

      return {
        ...oldData,
        data: [...[oldData?.data.filter((msg) => msg.id !== message.id)]],
        total: oldData.total - 1,
        groupedMessages,
      };
    });
  };

  const handleDeleteChat = (chat: Chat) => {
    const user = getUser();

    if (!user) {
      return;
    }

    navigate('/');
    setUser({ ...user, dialogs: user?.dialogs.filter((el) => el.id !== chat.id) } as User);
  };

  const handleEditMessage = (updatedMessage: Message) => {
    queryClient.setQueryData(['chat', updatedMessage.chatId], (oldData: ChatWithPagination) => {
      const user = getUser();

      if (!user) {
        return oldData;
      }

      const dialog = user.dialogs.find((d) => d.id === updatedMessage.chatId);

      if (dialog) {
        dialog.messages = dialog.messages.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg));
      }

      setUser(user);

      const messageDate = new Date(updatedMessage.createdAt).toDateString();
      const groupedMessages = {
        ...oldData.groupedMessages,
        [messageDate]: oldData.groupedMessages[messageDate].map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg,
        ),
      };

      return {
        ...oldData,
        data: oldData.data.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg)),
        groupedMessages,
      };
    });
  };

  const handleReadMessages = () => {
    const dialogId = window.location.pathname.split('/')[1];

    queryClient.setQueryData(['chat', dialogId], (oldData: ChatWithPagination) => {
      const user = getUser();

      if (!user) {
        return oldData;
      }

      const dialog = user.dialogs.find((d) => d.id === dialogId)?.users;

      if (!dialog) {
        return oldData;
      }

      if (oldData) {
        const readedIds = [dialog[0].id, dialog[1].id];

        const updatedData = oldData.data.map((msg) => ({ ...msg, readed: readedIds }));

        const updatedGroupedMessages = Object.keys(oldData.groupedMessages).reduce(
          (acc, key) => {
            acc[key] = oldData.groupedMessages[key].map((msg) => ({ ...msg, readed: readedIds }));
            return acc;
          },
          {} as { [key: string]: Message[] },
        );

        return {
          ...oldData,
          data: updatedData,
          groupedMessages: updatedGroupedMessages,
        };
      }

      return oldData;
    });
  };

  const handlePrint = ({ roomId, sender, printing }: { roomId: string; sender: string; printing: boolean }) => {
    queryClient.setQueryData(['chat', roomId], (oldData: ChatWithPagination) => {
      const user = getUser();

      if (!user) {
        return oldData;
      }

      user.dialogs = user.dialogs.map((dialog) => (dialog.id === roomId ? { ...dialog, printing } : dialog));

      setUser(user);

      return {
        ...oldData,
        printing,
      };
    });
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('message', handleMessage);
    socket.on('edit-message', handleEditMessage);
    socket.on('delete-message', handleDeleteMessage);
    socket.on('delete-chat', handleDeleteChat);
    socket.on('read-messages', handleReadMessages);
    socket.on('print', handlePrint);

    return () => {
      socket.off('message', handleMessage);
      socket.off('edit-message', handleEditMessage);
      socket.off('delete-message', handleDeleteMessage);
      socket.off('delete-chat', handleDeleteChat);
      socket.off('read-messages', handleReadMessages);
      socket.off('print', handlePrint);
    };
  }, [socket]);
};
