import { type DragEvent, type FC, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { useMessageStore } from '~/entities';
import { MessageInput, MessagesList, UserInfo } from '~/features';
import { useImageSendModalStore } from '~/features/ImageSendModal';
import {
  classNames,
  getRecipientFromUsers,
  groupMessagesByDate,
  messengerApi,
  useMobileStore,
  useThemeStore,
  useUserStore,
} from '~/shared';

import styles from './Chat.module.css';

const Chat: FC = () => {
  const { user } = useUserStore();
  const { theme } = useThemeStore();
  const { type, lastChat } = useMobileStore();
  const { inputValue, setInputValue } = useMessageStore();
  const { openModal, setFile, setRecipient, setDialogId } = useImageSendModalStore();

  const [dragging, setDragging] = useState(false);

  const params = useParams();
  const dialogId = params.dialogId ?? (type !== 'desktop' ? lastChat : '');
  const navigate = useNavigate();

  const { isLoading, data, error } = useQuery({
    queryKey: ['chat', dialogId],
    queryFn: async () => {
      const messages = await messengerApi.getChatMessages(dialogId);
      return { ...messages, groupedMessages: groupMessagesByDate(messages.data) };
    },
    retry: 0,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && user && data && data.data[0] && data.data[0].sender.id === user.id) {
      scrollRef.current.scrollTo({ behavior: 'smooth', top: scrollRef.current.scrollHeight });
    }
  }, [data?.groupedMessages]);

  useEffect(() => {
    if (error) {
      navigate('/');
    }
  }, [error]);

  useEffect(() => {
    if (!data || !user) {
      return;
    }

    const recipientUser = getRecipientFromUsers(data.users ?? [], user.id);

    document.title = `${recipientUser?.firstname} ${recipientUser?.lastname}`;

    return () => {
      document.title = 'Messenger';
    };
  }, [user, data]);

  const recipient = getRecipientFromUsers(data?.users ?? [], user?.id ?? '');

  const isDark = theme === 'dark';

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragging) {
      setDragging(true);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragging) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragging) {
      setDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragging) {
      setDragging(false);
    }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && recipient) {
      openModal();
      messengerApi.uploadFile(e.dataTransfer.files[0]).then((images) => {
        setFile(images[0]);
        setRecipient(recipient.id);
        setDialogId(dialogId ?? '');
      });
      e.dataTransfer.clearData();
    }
  };

  return (
    <main
      ref={chatRef}
      className={classNames(
        styles.root,
        isDark && styles.root_dark,
        type === 'tablet' && styles.tablet,
        type === 'mobile' && styles.mobile,
        !params.dialogId && styles.slide,
      )}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={classNames(dragging && styles.dragging)} />
      <UserInfo recipient={recipient} />
      <div className={classNames(styles.background, isDark && styles.background_dark)}>
        <MessagesList
          scrollRef={scrollRef}
          messages={data?.data}
          groupedMessages={data?.groupedMessages}
          recipient={recipient}
          isLoading={isLoading}
        />
      </div>
      <MessageInput inputValue={inputValue} setInputValue={setInputValue} recipient={recipient?.id ?? ''} />
    </main>
  );
};

export { Chat };
