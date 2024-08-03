import { type FC, type MouseEvent, memo, useEffect, useState } from 'react';
import { BsReply, BsTrash } from 'react-icons/bs';
import { GoChevronDown } from 'react-icons/go';
import { HiOutlinePencil } from 'react-icons/hi';
import { useParams } from 'react-router-dom';

import { useMessageStore } from '~/entities';
import { ContextMenu, type Message as TMessage, classNames, useContextMenu, useUserStore } from '~/shared';

import styles from './MessagesList.module.css';

import { MessagesByDateList } from '../MessagesByDateList';
import type { TMessagesListProps } from './MessagesList.types';

const MessagesList: FC<TMessagesListProps> = memo(({ groupedMessages, isLoading, messages, recipient, scrollRef }) => {
  const {
    selectedMessage,
    setReplyMessage,
    setIsVisibleReplyMessage,
    isVisibleReplyMessage,
    setSelectedMessage,
    inputValue,
    editMessage,
    replyMessage,
    setEditMessage,
    setIsVisibleEditMessage,
    isVisibleEditMessage,
    setInputValue,
  } = useMessageStore();
  const { user, socket } = useUserStore();
  const { dialogId } = useParams();

  const { contextMenu, contextMenuRef, showContextMenu, hideContextMenu } = useContextMenu(scrollRef);
  const [isArrowVisible, setIsArrowVisible] = useState(false);

  useEffect(() => {
    setEditMessage(null);
    setInputValue('');
    setReplyMessage(null);
    setIsVisibleEditMessage(false);
    setIsVisibleReplyMessage(false);
    setSelectedMessage(null);
  }, [dialogId]);

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>, message: TMessage) => {
    setSelectedMessage(message);
    showContextMenu(e);
  };

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
      recipient: recipient.id,
    });
  };

  const handleEditMessage = () => {
    hideContextMenu();
    if (replyMessage) {
      setIsVisibleReplyMessage(false);
    }

    if (selectedMessage) {
      setEditMessage(selectedMessage);
      setInputValue(selectedMessage.content);
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
    { icon: HiOutlinePencil, text: 'Edit', onClick: handleEditMessage, show: isMySelectedMessage },
    {
      icon: BsTrash,
      text: 'Delete',
      isDelete: true,
      onClick: handleDeleteMessage,
    },
  ];

  if (isLoading) {
    return (
      <div className={classNames(styles.root, styles.root_center)}>
        <div className='loader'></div>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        styles.root,
        (isVisibleReplyMessage || isVisibleEditMessage) && styles.root_reply,
        inputValue.includes('\n') && styles.root_spacing,
        inputValue.includes('\n') && (isVisibleReplyMessage || isVisibleEditMessage) && styles.root_reply_spacing,
        inputValue.split(/\r?\n/).length - 1 >= 2 && styles.root_spacing_big,
        inputValue.split(/\r?\n/).length - 1 >= 2 &&
          (isVisibleReplyMessage || isVisibleEditMessage) &&
          styles.root_spacing_reply_big,
      )}
      ref={scrollRef}
    >
      <MessagesByDateList groupedMessages={groupedMessages} messages={messages} onContextMenu={handleContextMenu} />
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
    </div>
  );
});

export { MessagesList };
