import { type FC, type MouseEvent, memo, useCallback, useEffect, useRef } from 'react';
import { BsReply, BsTrash } from 'react-icons/bs';
import { HiOutlinePencil } from 'react-icons/hi';
import { MdContentCopy } from 'react-icons/md';
import { PiShareFat } from 'react-icons/pi';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import { useMessageStore } from '~/entities';
import { useForwardMessageModalStore } from '~/features/ForwardMessageModal';
import { useMessageInputStore } from '~/features/MessageInput';
import { ScrollToBottomButton } from '~/features/ScrollToBottomButton';
import {
  ContextMenu,
  Skeleton,
  type Message as TMessage,
  useContextMenu,
  useMessagePagination,
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
    editMessage,
    replyMessage,
    setEditMessage,
    setIsVisibleEditMessage,
    forwardMessage,
    setIsVisibleForwardMessage,
  } = useMessageStore();
  const setInputValue = useMessageInputStore((state) => state.setInputValue);
  const openModal = useForwardMessageModalStore(useShallow((state) => state.openModal));

  const { user, socket } = useUserStore();
  const { dialogId } = useParams();

  const messagesRef = useRef<{ [key: string]: HTMLDivElement }>({});

  const { contextMenu, contextMenuRef, showContextMenu, hideContextMenu } = useContextMenu(scrollRef);

  const { loadMorePages } = useMessagePagination(dialogId, scrollRef);

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

    socket.emit('delete-message', {
      messageId: selectedMessage?.id,
      roomId: dialogId,
      recipient: recipient?.id,
    });
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

  const buttons = [
    {
      icon: MdContentCopy,
      text: 'Copy text',
      onClick: () => {
        toast.info('Copied to clipboard');
        navigator.clipboard.writeText(selectedMessage?.content || '');
        hideContextMenu();
      },
    },
    {
      icon: BsReply,
      text: 'Reply',
      onClick: handleReplyMessage,
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
    },
    {
      icon: HiOutlinePencil,
      text: 'Edit',
      onClick: handleEditMessage,
      show: isMySelectedMessage && !selectedMessage?.voiceMessage,
    },
    {
      icon: BsTrash,
      text: 'Delete',
      isDelete: true,
      onClick: handleDeleteMessage,
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.skeletons}>
        {new Array(30).fill(null).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={i} style={{ alignSelf: Math.random() > 0.5 ? 'flex-end' : 'flex-start' }}>
            <Skeleton.Rectangle
              width={100 * (Math.random() > 0.5 ? 2 : 1)}
              height={46 * (Math.random() > 0.5 ? 2 : 1)}
              borderRadius='var(--border-radius-8)'
            />
          </span>
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
