import { FormEvent, RefObject, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useMessageStore } from '~/entities';
import { useImageSendModalStore } from '~/features';
import { useUserStore } from '~/shared';

import { useOptimistSendMessage } from './useOptimistSendMessage';

export const useSendMessage = (
  dialogId?: string,
  recipient?: string,
  file?: string,
  isVoice?: boolean,
  inputValue?: string,
  setInputValue?: (inputValue: string) => void,
  onStopRecording?: () => void,
  scrollRef?: RefObject<HTMLDivElement>,
) => {
  const [socket] = useUserStore(useShallow((state) => [state.socket]));
  const { closeModal, isModalOpen } = useImageSendModalStore();
  const {
    editMessage,
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

  const { sendMessage } = useOptimistSendMessage(scrollRef);

  const [timer, setTimer] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isVisibleEmojiPicker, setIsVisibleEmojiPicker] = useState(false);

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
      sendMessage({ formattedMessage, file });
      if (forwardMessage && isVisibleForwardMessage) {
        setForwardMessage(null);
        setIsVisibleForwardMessage(false);
      } else {
        setReplyMessage(null);
        setIsVisibleReplyMessage(false);
      }
    }
  };

  return { timer, handleSubmit, setIsPrinting, isVisibleEmojiPicker, setIsVisibleEmojiPicker };
};
