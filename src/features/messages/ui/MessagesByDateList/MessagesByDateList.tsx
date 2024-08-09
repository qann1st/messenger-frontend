import { FC, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { Message } from '~/entities';
import { ChatWithPagination, type Message as TMessage, formatMessageDate, useMobileStore } from '~/shared';

import styles from './MessagesByDateList.module.css';

import { TMessagesByDateListProps } from './MessagesByDateList.types';

const MessagesByDateList: FC<TMessagesByDateListProps> = ({ onContextMenu, messagesRef }) => {
  const { type, lastChat } = useMobileStore();

  const dialogId = useParams().dialogId ?? (type !== 'desktop' ? lastChat : '');

  const { data } = useQuery<ChatWithPagination>({ queryKey: ['chat', dialogId] });

  const scrollToMessage = useCallback(async (id: string) => {
    if (messagesRef.current[id]) {
      messagesRef.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' });
      messagesRef.current[id].classList.add(styles.animate);
      setTimeout(() => messagesRef.current[id].classList.remove(styles.animate), 2050);
    } // else {
    //   const { page } = await messengerApi.getMessagePageById({ messageId: id, roomId: dialogId, limit: 30 });
    //   await loadMorePages(page - 1);

    //   console.log(Object.keys(messagesRef.current));
    //   messagesRef.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' });
    //   messagesRef.current[id].classList.add(styles.animate);
    //   setTimeout(() => messagesRef.current[id].classList.remove(styles.animate), 2050);
    // }
  }, []);

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
            onContextMenu={(e) => onContextMenu(e, message)}
            key={message.id}
            className={styles.pad}
          >
            <Message
              createdAt={message.createdAt}
              replyMessage={message.replyMessage ?? {}}
              hasAvatar={false}
              content={message.content}
              sender={message.sender}
              isEdited={message.isEdited}
              updatedAt={message.updatedAt}
              status={message.status}
              readed={message.readed ?? []}
              images={message.images ?? []}
              voiceMessage={message.voiceMessage}
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
