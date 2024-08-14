import { DragEvent, type FC, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { useQuery } from '@tanstack/react-query';

import { ImageModal, ImageSendModal, MessageInput, MessagesList, UserInfo, useMessageInputStore } from '~/features';
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

  return (
    <>
      <main
        ref={chatRef}
        className={classNames(
          styles.root,
          isDark && styles.root_dark,
          type === 'tablet' && styles.tablet,
          type === 'mobile' && styles.mobile,
          !params.dialogId && styles.slide,
        )}
        onDragOver={handleDragOver}
      >
        <UserInfo recipient={recipient} printing={data?.printing ?? false} />
        <div className={classNames(styles.background, isDark && styles.background_dark)}>
          <MessagesList isLoading={isLoading} scrollRef={scrollRef} recipient={recipient} />
        </div>
        <Fff recipient={recipient} />
      </main>
      <ImageSendModal />
      <ImageModal />
    </>
  );
};

export { Chat };

const Fff: FC<{ recipient?: User }> = ({ recipient }) => {
  const { inputValue, setInputValue, addInputValue } = useMessageInputStore();
  return (
    <MessageInput
      inputValue={inputValue}
      setInputValue={setInputValue}
      addInputValue={addInputValue}
      recipient={recipient?.id ?? ''}
    />
  );
};
