import { FC, useEffect, useMemo } from 'react';
import { BsReply, BsTrash } from 'react-icons/bs';
import { HiOutlinePencil } from 'react-icons/hi';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { MdContentCopy } from 'react-icons/md';
import { PiShareFat } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { useMessageStore } from '~/entities';
import { useForwardMessageModalStore } from '~/features/ForwardMessageModal';
import { useMessageInputStore } from '~/features/MessageInput';
import {
  ContextMenu,
  classNames,
  useContextMenu,
  useMessagesListSize,
  useOptimistSendMessage,
  useUserStore,
} from '~/shared';

import styles from './MessagesListLayout.module.css';

import { TMessagesListLayoutProps } from './MessagesListLayout.types';

export const useOkStore = create<{ callback: (e: any) => void; setCallback: (cb: any) => void }>((set) => ({
  callback: () => null,
  setCallback: (cb: any) => set({ callback: cb }),
}));

const MessagesListLayout: FC<TMessagesListLayoutProps> = ({ children, scrollRef, isLoading }) => {
  const { contextMenu, contextMenuRef, showContextMenu, hideContextMenu } = useContextMenu(scrollRef);
  const {
    selectedMessage,
    setReplyMessage,
    setIsVisibleReplyMessage,
    addSelectedMessages,
    setEditMessage,
    setIsVisibleEditMessage,
    editMessage,
    forwardMessage,
    replyMessage,
    setIsVisibleForwardMessage,
  } = useMessageStore();
  const openModal = useForwardMessageModalStore(useShallow((state) => state.openModal));
  const setCallback = useOkStore(useShallow((state) => state.setCallback));
  const setInputValue = useMessageInputStore(useShallow((state) => state.setInputValue));

  const { user } = useUserStore();

  const { deleteMessage } = useOptimistSendMessage();

  useEffect(() => {
    setCallback(showContextMenu);
  }, []);

  const isMySelectedMessage = useMemo(
    () => (selectedMessage ? selectedMessage.sender.id === user?.id : true),
    [selectedMessage, user],
  );
  const isShowSelectedMessages = true;

  const buttons = [
    {
      icon: MdContentCopy,
      text: 'Copy text',
      onClick: () => {
        toast.info('Copied to clipboard');
        navigator.clipboard.writeText(selectedMessage?.content || '');
        hideContextMenu();
      },
      show: isShowSelectedMessages,
    },
    {
      icon: BsReply,
      text: 'Reply',
      onClick: () => {
        hideContextMenu();
        if (editMessage) {
          setIsVisibleEditMessage(false);
        }
        if (forwardMessage) {
          setIsVisibleForwardMessage(false);
        }
        if (selectedMessage) {
          setReplyMessage(selectedMessage);
          setIsVisibleReplyMessage(true);
        }
      },
      show: isShowSelectedMessages,
    },
    {
      icon: PiShareFat,
      text: 'Forward',
      onClick: () => {
        if (selectedMessage) {
          openModal(selectedMessage);
        }
        hideContextMenu();
      },
      show: isShowSelectedMessages,
    },
    {
      icon: HiOutlinePencil,
      text: 'Edit',
      onClick: () => {
        hideContextMenu();
        if (replyMessage) {
          setIsVisibleEditMessage(false);
        }
        if (forwardMessage) {
          setIsVisibleForwardMessage(false);
        }
        if (selectedMessage) {
          setEditMessage(selectedMessage);
          setInputValue(selectedMessage.content.replaceAll(/\\n/g, '\n'));
          setIsVisibleEditMessage(true);
        }
      },
      show: isMySelectedMessage && !selectedMessage?.voiceMessage && isShowSelectedMessages,
    },
    {
      icon: IoIosCheckmarkCircleOutline,
      text: 'Select',
      onClick: () => {
        if (selectedMessage) {
          addSelectedMessages(selectedMessage);
        }
        hideContextMenu();
      },
      show: isShowSelectedMessages,
    },
    {
      icon: BsTrash,
      text: 'Delete',
      isDelete: true,
      onClick: () => {
        hideContextMenu();
        if (selectedMessage) {
          deleteMessage(selectedMessage);
        }
      },
      show: isShowSelectedMessages,
    },
  ];

  return (
    <div className={classNames(useMessagesListSize(styles), styles.root, isLoading && styles.pad)} ref={scrollRef}>
      {children}
      <ContextMenu
        ref={contextMenuRef}
        isToggled={contextMenu.toggled}
        posX={contextMenu.position.x}
        posY={contextMenu.position.y}
        buttons={buttons}
      />
    </div>
  );
};

export { MessagesListLayout };
