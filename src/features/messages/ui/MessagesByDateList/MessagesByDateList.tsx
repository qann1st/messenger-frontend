import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Message, useMessageStore } from '~/entities';
import {
  ChatWithPagination,
  type Message as TMessage,
  formatMessageDate,
  messengerApi,
  useMobileStore,
} from '~/shared';

import styles from './MessagesByDateList.module.css';

import { TMessagesByDateListProps } from './MessagesByDateList.types';

const MessagesByDateList: FC<TMessagesByDateListProps> = ({
  onContextMenu,
  onClick,
  messagesRef,
  loadMorePages,
  scrollRef,
}) => {
  const { type, lastChat } = useMobileStore();

  const params = useParams();
  const dialogId = params.dialogId ?? (type !== 'desktop' ? lastChat : '');
  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData<ChatWithPagination>(['chat', dialogId]);

  const { data = cachedData } = useQuery<ChatWithPagination>({
    queryKey: ['chat', dialogId],
    initialData: () => queryClient.getQueryData(['chat', dialogId]),
    enabled: !cachedData,
  });

  const [loadedMorePages, setLoadedMorePages] = useState<{ fetching: boolean; lastId?: string }>({
    fetching: false,
  });
  const [setIsVisibleReplyMessage, setReplyMessage] = useMessageStore(
    useShallow((state) => [state.setIsVisibleReplyMessage, state.setReplyMessage]),
  );

  const scrollToMessage = useCallback(async (id: string) => {
    if (messagesRef.current[id]) {
      messagesRef.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' });
      messagesRef.current[id].classList.add(styles.animate);
      setTimeout(() => messagesRef.current[id].classList.remove(styles.animate), 2050);
    } else {
      setLoadedMorePages({ fetching: true, lastId: id });
      const { page: scrollPage } = await messengerApi.getMessagePageById({
        messageId: id,
        roomId: window.location.pathname.split('/')[1] ?? '',
        limit: 30,
      });
      await loadMorePages(scrollPage).finally(() => setLoadedMorePages({ fetching: false, lastId: id }));
    }
  }, []);

  useEffect(() => {
    if (loadedMorePages.fetching) {
      setLoadedMorePages({ fetching: false });
    } else {
      if (loadedMorePages.lastId && messagesRef.current[loadedMorePages.lastId]) {
        scrollToMessage(loadedMorePages.lastId);
      }
    }
  }, [loadedMorePages]);

  return Object.entries<TMessage[]>(data?.groupedMessages ?? {})?.map(([date, messagesByDate]) => {
    const formattedDate = formatMessageDate(messagesByDate[0] ? messagesByDate[0].createdAt : 0);

    return (
      <div key={date} className={styles.dateGroup}>
        {messagesByDate.map((message) => (
          <div
            ref={(el) => {
              if (el) {
                return (messagesRef.current[message.id] = el);
              }
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onContextMenu(e, message);
            }}
            // onClick={(e) => onClick?.(e, message)}
            onDoubleClick={(e) => {
              e.preventDefault();
              if (type === 'desktop') {
                setIsVisibleReplyMessage(true);
                setReplyMessage(message);
              }
            }}
            key={message.id}
            className={styles.pad}
          >
            <Message
              forwardedMessage={message.forwardedMessage ?? {}}
              createdAt={message.createdAt}
              replyMessage={message.replyMessage ?? {}}
              hasAvatar={false}
              content={message.content}
              sender={message.sender}
              scrollRef={scrollRef}
              isEdited={message.isEdited}
              updatedAt={message.updatedAt}
              status={message.status}
              message={message}
              readed={message.readed ?? []}
              images={(message.images ? message.images : message.forwardedMessage?.images) ?? []}
              voiceMessage={message.voiceMessage ? message.voiceMessage : message.forwardedMessage?.voiceMessage}
              scrollToMessage={scrollToMessage}
            />
          </div>
        ))}
        {messagesByDate[0] && (
          <div className={styles.info}>
            <p className={styles.text}>{formattedDate}</p>
          </div>
        )}
      </div>
    );
  });
};

export { MessagesByDateList };
