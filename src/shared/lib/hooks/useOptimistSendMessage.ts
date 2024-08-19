import { RefObject } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useQueryClient } from '@tanstack/react-query';

import { useMessageStore } from '~/entities';
import { Chat, ChatWithPagination, Message, useUserStore } from '~/shared';

import { getRecipientFromUsers, uuidv4 } from '../helpers';

export const useOptimistSendMessage = (scrollRef?: RefObject<HTMLDivElement>) => {
  const [socket, getUser, setUser] = useUserStore(useShallow((state) => [state.socket, state.getUser, state.setUser]));
  const { replyMessage, forwardMessage, getReplyMessage, setIsVisibleReplyMessage } = useMessageStore();

  const queryClient = useQueryClient();

  const sendMessage = ({
    file,
    formattedMessage,
    size,
    voiceMessage,
  }: {
    formattedMessage?: string;
    file?: string;
    voiceMessage?: Blob;
    size?: number;
  }) => {
    const user = getUser();
    if (!user) {
      return;
    }

    const msgDate = import.meta.env.MODE === 'development' ? new Date(new Date().getTime() - 10800000) : new Date();

    const msgDateString = msgDate.toISOString();

    const dialogId = window.location.pathname.split('/')[1];

    const newMessage = {
      id: uuidv4(),
      chatId: dialogId ?? '',
      content: formattedMessage as string,
      forwardedMessage: forwardMessage as Message,
      replyMessage: replyMessage as Message,
      voiceMessage: voiceMessage ? URL.createObjectURL(voiceMessage) : '',
      createdAt: msgDateString,
      updatedAt: msgDateString,
      images: file ? [file] : [],
      sender: user,
      readed: [user.id],
      status: 'pending',
    } satisfies Message;

    const dialogIndex = user.dialogs.findIndex((d) => d.id === newMessage.chatId);
    const dialog = user.dialogs[dialogIndex];

    const recipient = getRecipientFromUsers(dialog?.users ?? [], user.id)?.id;

    queryClient.setQueryData(['chat', newMessage.chatId], (oldData: ChatWithPagination) => {
      if (
        !user ||
        (!newMessage.voiceMessage &&
          !newMessage.content &&
          !newMessage.images.length &&
          !newMessage.forwardedMessage?.chatId)
      ) {
        return;
      }

      if (dialogId === newMessage.chatId) {
        socket?.emit('read-messages', {
          roomId: dialogId,
          recipient,
        });
      }

      if (dialog) {
        dialog.messages = [newMessage];

        if (newMessage.sender.id !== user.id && dialogId !== newMessage.chatId) {
          dialog.unreadedMessages += 1;
        }

        user.dialogs.splice(dialogIndex, 1);

        user.dialogs.unshift(dialog);
      } else {
        user.dialogs.unshift({
          id: newMessage.chatId,
          messages: [newMessage],
          users: [newMessage.sender, user],
        } as Chat);
      }

      setUser(user);

      let groupedMessages = oldData?.groupedMessages ?? {};
      const date = new Date(newMessage.createdAt).toDateString();
      const arr = groupedMessages[date];

      if (!arr) {
        groupedMessages = { [date]: [newMessage], ...groupedMessages };
      } else {
        arr.unshift(newMessage);
      }

      if (oldData.total > oldData.data?.length) {
        oldData.data.pop();
      }

      return {
        ...oldData,
        data: [newMessage, ...(oldData?.data ?? [])],
        total: (oldData?.total ?? 0) + 1,
        groupedMessages,
      };
    });

    scrollRef?.current?.scrollTo({ behavior: 'smooth', top: 0 });

    socket?.emit('message', {
      id: newMessage.id,
      content: formattedMessage,
      recipient,
      chatId: dialogId,
      replyMessage: replyMessage?.id,
      forwardedMessage: forwardMessage?.id,
      images: file ? [file] : [],
      size,
      voiceMessage,
    });
  };

  const deleteMessage = (message: Message) => {
    const user = getUser();

    if (!user) {
      return;
    }

    const dialogId = window.location.pathname.split('/')[1];

    const dialogIndex = user.dialogs.findIndex((d) => d.id === message.chatId);
    const dialog = user.dialogs[dialogIndex];
    const recipient = getRecipientFromUsers(dialog?.users ?? [], user.id);

    if (socket) {
      socket.emit('delete-message', {
        messageId: message.id,
        roomId: dialogId,
        recipient: recipient?.id,
      });
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

  return { sendMessage, deleteMessage };
};
