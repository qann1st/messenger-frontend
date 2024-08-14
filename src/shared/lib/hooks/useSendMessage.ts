import { FormEvent, useEffect, useState } from 'react';

import { useMessageStore } from '~/entities';
import { useImageSendModalStore } from '~/features';
import { useUserStore } from '~/shared';

export const useSendMessage = (
  dialogId?: string,
  recipient?: string,
  file?: string | null,
  isVoice?: boolean,
  inputValue?: string,
  setInputValue?: (inputValue: string) => void,
  onStopRecording?: () => void,
) => {
  const { socket, getUser } = useUserStore();
  const { closeModal, isModalOpen } = useImageSendModalStore();
  const {
    editMessage,
    replyMessage,
    setEditMessage,
    isVisibleEditMessage,
    setIsVisibleEditMessage,
    setReplyMessage,
    setIsVisibleReplyMessage,
  } = useMessageStore();

  const [timer, setTimer] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);

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

    if (!isModalOpen && (!inputValue || !inputValue.trim() || isVoice)) {
      return;
    }

    const formattedMessage = inputValue?.trim().replaceAll(/\n/g, '\\n');

    if (!isModalOpen && ((formattedMessage?.length ?? 0) < 1 || (formattedMessage?.length ?? 0) > 1000)) {
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

      socket?.emit('message', {
        content: formattedMessage,
        recipient,
        chatId: dialogId,
        replyMessage: replyMessage?.id,
        images: file ? [file] : [],
      });

      setReplyMessage(null);
      setIsVisibleReplyMessage(false);
    }
  };

  return { timer, handleSubmit, setIsPrinting };
};
