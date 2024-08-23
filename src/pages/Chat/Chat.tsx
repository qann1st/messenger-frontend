import { DragEvent, type FC, RefObject, memo, useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { useQuery } from '@tanstack/react-query';

import {
  ForwardMessageModal,
  ImageModal,
  ImageSendModal,
  MessageInput,
  MessagesList,
  UserInfo,
  useMessageInputStore,
} from '~/features';
import {
  User,
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
  const { type, lastChat, setLastChat } = useMobileStore();
  const setIsDragging = useMessageInputStore(useShallow((state) => state.setIsDragging));

  const params = useParams();
  const dialogId = params.dialogId ?? (type !== 'desktop' ? lastChat : '');
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ['chat', dialogId],
    queryFn: async () => {
      const messages = await messengerApi.getChatMessages(dialogId);
      return { ...messages, groupedMessages: groupMessagesByDate(messages.data) };
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setLastChat(params.dialogId ?? '');
  }, []);

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

  const recipient = useMemo(() => getRecipientFromUsers(data?.users ?? [], user?.id ?? ''), [data]);

  const isDark = theme === 'dark';

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX !== null && e.changedTouches[0].clientX !== null) {
      const swipeDistance = e.changedTouches[0].clientX - touchStartX;

      if (swipeDistance > 75) {
        navigate('/');
      }
    }

    setTouchStartX(null);
  };

  return (
    <>
      <main
        ref={chatRef}
        className={classNames(styles.root, isDark && styles.root_dark, styles[type], !params.dialogId && styles.slide)}
        onDragOver={handleDragOver}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <UserInfo hasAvatar recipient={recipient} printing={data?.printing ?? false} />
        <Ggg isLoading={isLoading} scrollRef={scrollRef} isDark={isDark} />
        <Fff scrollRef={scrollRef} recipient={recipient} />
      </main>
      <ForwardMessageModal />
      <ImageSendModal />
      <ImageModal />
    </>
  );
};

export { Chat };

const Ggg: FC<{ scrollRef: RefObject<HTMLDivElement>; isLoading: boolean; isDark: boolean }> = memo(
  ({ isLoading, scrollRef, isDark }) => (
    <div className={classNames(styles.background, isDark && styles.background_dark)}>
      <MessagesList isLoading={isLoading} scrollRef={scrollRef} />
    </div>
  ),
);

const Fff: FC<{ recipient?: User; scrollRef?: RefObject<HTMLDivElement> }> = memo(({ recipient, scrollRef }) => {
  const { inputValue, setInputValue, addInputValue } = useMessageInputStore();

  return (
    <MessageInput
      inputValue={inputValue}
      scrollRef={scrollRef}
      setInputValue={setInputValue}
      addInputValue={addInputValue}
      recipient={recipient?.id ?? ''}
    />
  );
});
