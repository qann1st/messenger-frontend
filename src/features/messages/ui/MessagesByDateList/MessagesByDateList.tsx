import { FC, memo } from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { Message } from '~/entities';
import { formatMessageDate, type Message as TMessage } from '~/shared';

import styles from './MessagesByDateList.module.css';

import { TMessagesByDateListProps } from './MessagesByDateList.types';

const MessagesByDateList: FC<TMessagesByDateListProps> = memo(({ onContextMenu }) => {
  const { dialogId = '' } = useParams();

  const { data } = useQuery({ queryKey: ['chat', dialogId] });

  return Object.entries<TMessage[]>(data.groupedMessages).map(([date, messagesByDate]) => {
    const formattedDate = formatMessageDate(messagesByDate[0] ? messagesByDate[0].createdAt : 0);

    return (
      <div key={date} className={styles.dateGroup}>
        {messagesByDate.map((message) => (
          <div onContextMenu={(e) => onContextMenu(e, message)} key={message.id}>
            <Message
              createdAt={message.createdAt}
              replyMessage={data.data.find((msg: TMessage) => message.replyMessage === msg.id) ?? ({} as TMessage)}
              hasAvatar={false}
              content={message.content}
              sender={message.sender}
              isEdited={message.isEdited}
              updatedAt={message.updatedAt}
              status={message.status}
              readed={message.readed ?? []}
              images={message.images ?? []}
              voiceMessage={message.voiceMessage}
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
});

export { MessagesByDateList };

