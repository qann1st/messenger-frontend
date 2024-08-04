import { type FC, memo, useRef } from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { FaRegClock } from 'react-icons/fa';
import { IoCheckmark } from 'react-icons/io5';

import { Avatar, MessagePreview, classNames, formatCreatedTime, highlightMessage, useUserStore } from '~/shared';

import styles from './Message.module.css';

import { TMessageProps } from './Message.types';

const Message: FC<TMessageProps> = memo(
  ({ sender, content, isEdited, updatedAt, replyMessage, hasAvatar, createdAt, status }) => {
    const { user } = useUserStore();

    const messageRef = useRef<HTMLDivElement>(null);

    const date = new Date(updatedAt !== createdAt ? updatedAt : createdAt);
    const timeFormatter = new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit', hour12: false });
    const formattedTime = timeFormatter.format(date);

    const isMyMessage = sender.id === user?.id;

    return (
      <div ref={messageRef} className={classNames(styles.root, isMyMessage && styles.reverse)}>
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
            <div className={classNames(styles.message_info, !isMyMessage && styles.message_info_reverse)}>
              <p className={styles.time} title={`${formatCreatedTime(createdAt, updatedAt)}`}>
                {isEdited && 'edited'} {formattedTime}
              </p>
              {status === 'pending' && <FaRegClock size={12} style={{ marginBottom: '2px' }} />}
              {(status === 'success' || !status) && <IoCheckmark />}
              {status === 'error' && (
                <BiErrorCircle
                  color={isMyMessage ? 'var(--color-message-error)' : 'var(--color-recipient-error)'}
                  size={16}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export { Message };
