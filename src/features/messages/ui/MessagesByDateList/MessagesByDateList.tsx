import { FC, memo } from 'react';

import { Message } from '~/entities';
import { type Message as TMessage, formatMessageDate } from '~/shared';

import styles from './MessagesByDateList.module.css';

import { TMessagesByDateListProps } from './MessagesByDateList.types';

const MessagesByDateList: FC<TMessagesByDateListProps> = memo(({ groupedMessages, messages, onContextMenu }) =>
  Object.entries<TMessage[]>(groupedMessages).map(([date, messagesByDate]) => {
    const formattedDate = formatMessageDate(messagesByDate[0] ? messagesByDate[0].createdAt : '0');

    return (
      <div key={date} className={styles.dateGroup}>
        {messagesByDate.map((message) => (
          <div onContextMenu={(e) => onContextMenu(e, message)} key={message.id}>
            <Message
              createdAt={message.createdAt}
              replyMessage={messages.find((msg) => message.replyMessage === msg.id) ?? ({} as TMessage)}
              hasAvatar={false}
              content={message.content}
              sender={message.sender}
              isEdited={message.isEdited}
              updatedAt={message.updatedAt}
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
  }),
);

export { MessagesByDateList };
