import { FormEvent, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useQueryClient } from '@tanstack/react-query';

import { useMessageStore } from '~/entities';
import { useImageSendModalStore } from '~/features';
import { Chat, ChatWithPagination, Message, getRecipientFromUsers, useUserStore, uuidv4 } from '~/shared';

export const useSendMessage = (
  dialogId?: string,
  recipient?: string,
  file?: string | null,
  isVoice?: boolean,
  inputValue?: string,
  setInputValue?: (inputValue: string) => void,
  onStopRecording?: () => void,
) => {
  const [socket, getUser, setUser] = useUserStore(useShallow((state) => [state.socket, state.getUser, state.setUser]));
  const { closeModal, isModalOpen } = useImageSendModalStore();
  const {
    editMessage,
    replyMessage,
    setEditMessage,
    isVisibleEditMessage,
    setIsVisibleEditMessage,
    setReplyMessage,
    setIsVisibleReplyMessage,
    forwardMessage,
    setForwardMessage,
    setIsVisibleForwardMessage,
    isVisibleForwardMessage,
  } = useMessageStore();

  const [timer, setTimer] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isVisibleEmojiPicker, setIsVisibleEmojiPicker] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isVoice) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 10);
      }, 10);
      return () => clearInterval(interval);
    } else {
      setTimer(0);
    }
  }, [isVoice]);

  useEffect(() => {
    if (!inputValue?.length) {
      setIsPrinting(false);

      return;
    }

    const timeout = setTimeout(() => {
      setIsPrinting(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [inputValue]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit('print', {
      roomId: dialogId,
      recipient,
      startPrint: isPrinting,
    });
  }, [socket, isPrinting]);

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (isVoice && onStopRecording) {
      onStopRecording();
      return;
    }

    if (!isModalOpen && (!inputValue || !inputValue.trim() || isVoice) && !isVisibleForwardMessage) {
      return;
    }

    const formattedMessage = inputValue?.trim().replaceAll(/\n/g, '\\n');

    if (
      !isModalOpen &&
      ((formattedMessage?.length ?? 0) < 1 || (formattedMessage?.length ?? 0) > 1000) &&
      !isVisibleForwardMessage
    ) {
      return;
    }

    setInputValue?.('');

    if (isModalOpen) {
      closeModal();
    }

    if (editMessage && isVisibleEditMessage) {
      socket?.emit('edit-message', {
        messageId: editMessage.id,
        roomId: editMessage.chatId,
        content: formattedMessage,
        recipient,
      });
      setEditMessage(null);
      setIsVisibleEditMessage(false);
    } else {
      const user = getUser();
      if (!user) {
        return;
      }

      if (forwardMessage && isVisibleForwardMessage) {
        socket?.emit('message', {
          recipient,
          chatId: dialogId,
          forwardedMessage: forwardMessage?.id,
          images: file ? [file] : [],
        });
        setForwardMessage(null);
        setIsVisibleForwardMessage(false);
      } else {
        const msgDate = new Date();
        const msgDateString = msgDate.toISOString();

        const newMessage = {
          id: uuidv4(),
          chatId: dialogId,
          content: formattedMessage,
          createdAt: msgDateString,
          updatedAt: msgDateString,
          images: file ? [file] : [],
          sender: user,
          readed: [user.id],
          status: 'pending',
        } as Message;

        queryClient.setQueryData(['chat', newMessage.chatId], (oldData: ChatWithPagination) => {
          if (
            !user ||
            (!newMessage.voiceMessage &&
              !newMessage.content &&
              !newMessage.images.length &&
              !newMessage.forwardedMessage.chatId)
          ) {
            return;
          }

          const dialogIndex = user.dialogs.findIndex((d) => d.id === newMessage.chatId);
          const dialog = user.dialogs[dialogIndex];

          if (dialogId === newMessage.chatId) {
            socket?.emit('read-messages', {
              roomId: dialogId,
              recipient: getRecipientFromUsers(dialog?.users ?? [], user.id)?.id,
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

        socket?.emit('message', {
          id: newMessage.id,
          content: formattedMessage,
          recipient,
          chatId: dialogId,
          replyMessage: replyMessage?.id,
          images: file ? [file] : [],
        });
      }

      setReplyMessage(null);
      setIsVisibleReplyMessage(false);
    }
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('message', (message) => {
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
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);

  return { timer, handleSubmit, setIsPrinting, isVisibleEmojiPicker, setIsVisibleEmojiPicker };
};
