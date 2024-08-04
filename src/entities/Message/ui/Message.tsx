import { type FC, memo } from 'react';

import { Avatar, MessagePreview, classNames, formatCreatedTime, highlightMessage, useUserStore } from '~/shared';

import styles from './Message.module.css';

import { TMessageProps } from './Message.types';

const Message: FC<TMessageProps> = memo(
  ({ sender, content, isEdited, updatedAt, replyMessage, hasAvatar, createdAt }) => {
    const { user } = useUserStore();

    const date = new Date(updatedAt !== createdAt ? updatedAt : createdAt);
    const timeFormatter = new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit', hour12: false });
    const formattedTime = timeFormatter.format(date);

    const isMyMessage = sender.id === user?.id;

    return (
      <div className={classNames(styles.root, isMyMessage && styles.reverse)}>
        {hasAvatar && <Avatar firstName={sender.firstname} lastName={sender.lastname} size='medium' />}
        <div className={classNames(styles.content, !isMyMessage && styles.content_reverse)}>
          {replyMessage.chatId && (
            <MessagePreview
              type='message'
              isColor={!isMyMessage}
              className={classNames(styles.message_preview)}
              message={replyMessage}
            />
          )}
          <div className={styles.content_info}>
            <div>
              {content.split('\\n').map((line, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <span key={i}>
                  <p
                    className={styles.text}
                    dangerouslySetInnerHTML={{ __html: highlightMessage(line, styles, isMyMessage) }}
                  />
                  {i < content.split('\\n').length - 1 && <br />}
                </span>
              ))}
            </div>
            <div className={styles.message_info}>
              <p className={styles.time} title={`${formatCreatedTime(createdAt, updatedAt)}`}>
                {isEdited && 'edited'} {formattedTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export { Message };
