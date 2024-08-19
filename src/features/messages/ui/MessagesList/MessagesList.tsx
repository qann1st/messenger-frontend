import { type FC, type MouseEvent, memo, useCallback, useEffect, useRef } from 'react';
import { BsReply, BsTrash } from 'react-icons/bs';
import { HiOutlinePencil } from 'react-icons/hi';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { MdContentCopy } from 'react-icons/md';
import { PiShareFat } from 'react-icons/pi';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import { useMessageStore } from '~/entities';
import { ScrollToBottomButton, useForwardMessageModalStore, useMessageInputStore } from '~/features';
import {
  ContextMenu,
  Message,
  Skeleton,
  type Message as TMessage,
  useContextMenu,
  useMessagePagination,
  useMobileStore,
  useOptimistSendMessage,
  useUserStore,
} from '~/shared';

import styles from './MessagesList.module.css';

import { MessagesByDateList } from '../MessagesByDateList';
import { MessagesListLayout } from '../MessagesListLayout';
import type { TMessagesListProps } from './MessagesList.types';

const MessagesList: FC<TMessagesListProps> = memo(({ recipient, scrollRef, isLoading }) => {
  const {
    selectedMessage,
    setReplyMessage,
    setIsVisibleReplyMessage,
    setSelectedMessage,
    addSelectedMessages,
    editMessage,
    replyMessage,
    setEditMessage,
    setIsVisibleEditMessage,
    forwardMessage,
    setIsVisibleForwardMessage,
  } = useMessageStore();
  const setInputValue = useMessageInputStore((state) => state.setInputValue);
  const type = useMobileStore(useShallow((state) => state.type));
  const openModal = useForwardMessageModalStore(useShallow((state) => state.openModal));

  const { user, socket } = useUserStore();
  const { dialogId } = useParams();

  const messagesRef = useRef<{ [key: string]: HTMLDivElement }>({});

  const { contextMenu, contextMenuRef, showContextMenu, hideContextMenu } = useContextMenu(scrollRef);

  const { loadMorePages } = useMessagePagination(dialogId, scrollRef);
  const { deleteMessage } = useOptimistSendMessage();

  useEffect(() => {
    setInputValue('');
    setEditMessage(null);
    setReplyMessage(null);
    setIsVisibleEditMessage(false);
    setIsVisibleReplyMessage(false);
    setSelectedMessage(null);
  }, [dialogId]);

  useEffect(() => {
    if (!selectedMessage) {
      hideContextMenu();
    }
  }, [selectedMessage]);

  const handleContextMenu = useCallback((e: MouseEvent<HTMLDivElement>, message: TMessage) => {
    setSelectedMessage(message);
    showContextMenu(e);
  }, []);

  const handleReplyMessage = () => {
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
  };

  const handleDeleteMessage = () => {
    hideContextMenu();
    if (!socket) {
      return;
    }

    if (selectedMessage) {
      deleteMessage(selectedMessage);
    }
  };

  const handleEditMessage = () => {
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
  };

  const isMySelectedMessage = selectedMessage ? selectedMessage.sender.id === user?.id : true;
  const isShowSelectedMessages = true;
  // const isShowSelectedMessages = !selectedMessages.find((el) => el.id === selectedMessage?.id);

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
      onClick: handleReplyMessage,
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
      onClick: handleEditMessage,
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
      onClick: handleDeleteMessage,
      show: isShowSelectedMessages,
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.skeletons}>
        {new Array(Math.trunc(window.innerHeight * 0.015)).fill(null).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} style={{ alignSelf: Math.random() > 0.5 ? 'flex-end' : 'flex-start' }}>
            <Skeleton.Rectangle width={200} height={46} borderRadius='var(--border-radius-8)' />
          </div>
        ))}
      </div>
    );
  }

  return (
    <MessagesListLayout isLoading={isLoading} scrollRef={scrollRef}>
      <MessagesByDateList
        loadMorePages={loadMorePages}
        scrollRef={scrollRef}
        messagesRef={messagesRef}
        onContextMenu={handleContextMenu}
        onClick={(e, message: Message) => {
          if (type !== 'desktop') {
            addSelectedMessages(message);
          }
        }}
      />
      <ContextMenu
        ref={contextMenuRef}
        isToggled={contextMenu.toggled}
        posX={contextMenu.position.x}
        posY={contextMenu.position.y}
        buttons={buttons}
      />
      <ScrollToBottomButton scrollRef={scrollRef} />
    </MessagesListLayout>
  );
});

export { MessagesList };
