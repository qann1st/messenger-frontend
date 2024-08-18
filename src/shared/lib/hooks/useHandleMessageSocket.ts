import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { useMessageStore } from '~/entities';
import { type Chat, type ChatWithPagination, Message, User, useUserStore } from '~/shared';

export const useHandleMessageSocket = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { socket, getUser, setUser } = useUserStore();
  const { getReplyMessage, setIsVisibleReplyMessage } = useMessageStore();

  const handleDeleteMessage = (message: Message) => {
    queryClient.setQueryData(['chat', message.chatId], (oldData: ChatWithPagination) => {
      const user = getUser();

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

    socket.on('edit-message', handleEditMessage);
    socket.on('delete-message', handleDeleteMessage);
    socket.on('delete-chat', handleDeleteChat);
    socket.on('read-messages', handleReadMessages);
    socket.on('print', handlePrint);

    return () => {
      socket.off('edit-message', handleEditMessage);
      socket.off('delete-message', handleDeleteMessage);
      socket.off('delete-chat', handleDeleteChat);
      socket.off('read-messages', handleReadMessages);
      socket.off('print', handlePrint);
    };
  }, [socket]);
};
