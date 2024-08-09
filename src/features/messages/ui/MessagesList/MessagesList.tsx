import { type FC, type MouseEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import { BsReply, BsTrash } from 'react-icons/bs';
import { GoChevronDown } from 'react-icons/go';
import { HiOutlinePencil } from 'react-icons/hi';
import { useParams } from 'react-router-dom';

import { useMessageStore } from '~/entities';
import { useMessageInputStore } from '~/features/MessageInput';
import {
  ContextMenu,
  Skeleton,
  type Message as TMessage,
  classNames,
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
  } = useMessageStore();
  const setInputValue = useMessageInputStore((state) => state.setInputValue);

  const { user, socket } = useUserStore();
  const { dialogId } = useParams();

  const messagesRef = useRef<{ [key: string]: HTMLDivElement }>({});

  const { contextMenu, contextMenuRef, showContextMenu, hideContextMenu } = useContextMenu(scrollRef);
  const [isArrowVisible, setIsArrowVisible] = useState(false);

  useMessagePagination(dialogId, scrollRef);

  useEffect(() => {
    setEditMessage(null);
    setInputValue('');
    setReplyMessage(null);
    setIsVisibleEditMessage(false);
    setIsVisibleReplyMessage(false);
    setSelectedMessage(null);
  }, [dialogId]);

  const handleContextMenu = useCallback((e: MouseEvent<HTMLDivElement>, message: TMessage) => {
    setSelectedMessage(message);
    showContextMenu(e);
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      if (scrollRef.current.scrollTop < -scrollRef.current.clientHeight) {
        setIsArrowVisible(true);
      } else {
        setIsArrowVisible(false);
      }
    }
  };

  useEffect(() => {
    if (!selectedMessage) {
      hideContextMenu();
    }
  }, [selectedMessage]);

  const handleArrowClick = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ behavior: 'smooth', top: scrollRef.current.clientHeight });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleReplyMessage = () => {
    hideContextMenu();
    if (editMessage) {
      setIsVisibleEditMessage(false);
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
      setIsVisibleReplyMessage(false);
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
      icon: BsReply,
      text: 'Reply',
      onClick: handleReplyMessage,
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
      <MessagesByDateList messagesRef={messagesRef} onContextMenu={handleContextMenu} />
      <ContextMenu
        ref={contextMenuRef}
        isToggled={contextMenu.toggled}
        posX={contextMenu.position.x}
        posY={contextMenu.position.y}
        buttons={buttons}
      />
      <button onClick={handleArrowClick} className={classNames(styles.arrow, isArrowVisible && styles.arrow_visible)}>
        <GoChevronDown size={32} />
      </button>
    </MessagesListLayout>
  );
});

export { MessagesList };
