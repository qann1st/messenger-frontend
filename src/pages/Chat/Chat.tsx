import { type FC, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { MessageInput, MessagesList, UserInfo } from '~/features';
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

  return (
    <div
      ref={chatRef}
      className={classNames(
        styles.root,
        isDark && styles.root_dark,
        type === 'tablet' && styles.tablet,
        type === 'mobile' && styles.mobile,
        !params.dialogId && styles.slide,
      )}
    >
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
      <MessageInput scrollRef={scrollRef} recipient={recipient?.id ?? ''} />
    </div>
  );
};

export { Chat };
