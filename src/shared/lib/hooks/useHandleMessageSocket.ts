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

  const handleMessage = (message: Message) => {
    queryClient.setQueryData(['chat', message.chatId], (oldData: ChatWithPagination) => {
      const user = getUser();

      if (!user) {
        return;
      }

      const dialog = user.dialogs.find((d) => d.id === message.chatId);

      if (dialog) {
        dialog.messages = [message];
      } else {
        if (message.sender.id !== user?.id) {
          user.dialogs.unshift({
            id: message.chatId,
            messages: [message],
            users: [message.sender, user],
          } as Chat);
        }
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

      return {
        ...oldData,
        data: [message, ...(oldData?.data ?? [])],
        total: (oldData?.total ?? 0) + 1,
        groupedMessages,
      };
    });
  };

  const handleDeleteMessage = (message: Message) => {
    queryClient.setQueryData(['chat', message.chatId], (oldData: ChatWithPagination) => {
      const user = getUser();

      if (!user) {
        return;
      }

      const messageDate = new Date(message.createdAt).toDateString();

      const groupedMessages = {
        ...oldData.groupedMessages,
        [messageDate]: oldData.groupedMessages[messageDate].filter((msg) => msg.id !== message.id),
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
        data: [...oldData.data.filter((msg) => msg.id !== message.id)],
        total: oldData.total - 1,
        groupedMessages,
      };
    });
  };

  const handleDeleteChat = (chat: Chat) => {
    const user = getUser();

    if (!user) {
      return null;
    }

    navigate('/');
    setUser({ ...user, dialogs: user?.dialogs.filter((el) => el.id !== chat.id) } as User);
  };

  const handleEditMessage = (updatedMessage: Message) => {
    queryClient.setQueryData(['chat', updatedMessage.chatId], (oldData: ChatWithPagination) => {
      const user = getUser();

      if (!user) {
        return;
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

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('message', handleMessage);
    socket.on('edit-message', handleEditMessage);
    socket.on('delete-message', handleDeleteMessage);
    socket.on('delete-chat', handleDeleteChat);

    return () => {
      socket.off('message', handleMessage);
      socket.on('edit-message', handleEditMessage);
      socket.on('delete-message', handleDeleteMessage);
      socket.on('delete-chat', handleDeleteChat);
    };
  }, [socket]);
};
