import { type FC, memo, useEffect, useRef, useState } from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { FaRegClock } from 'react-icons/fa';
import { IoCheckmark } from 'react-icons/io5';

import { useImageModalStore } from '~/features/ImageModal';
import { Avatar, MessagePreview, classNames, formatCreatedTime, highlightMessage, useUserStore } from '~/shared';

import styles from './Message.module.css';

import { TMessageProps } from './Message.types';

const Message: FC<TMessageProps> = memo(
  ({ sender, content, isEdited, updatedAt, replyMessage, hasAvatar, createdAt, images, status }) => {
    const { user } = useUserStore();
    const { openModal, setImageLink } = useImageModalStore();

    const messageRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const [smallMessage, setSmallMessage] = useState(false);

    const date = new Date(updatedAt !== createdAt ? updatedAt : createdAt);
    const timeFormatter = new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit', hour12: false });
    const formattedTime = timeFormatter.format(date);

    const isMyMessage = sender.id === user?.id;

    useEffect(() => {
      console.log(imageRef.current?.width);
      if (imageRef.current) {
        if (imageRef.current.width && imageRef.current.width < 321) {
          setSmallMessage(true);
        }
      }
    }, [imageRef.current]);

    return (
      <div ref={messageRef} className={classNames(styles.root, isMyMessage && styles.reverse)}>
        {hasAvatar && <Avatar firstName={sender.firstname} lastName={sender.lastname} size='medium' />}
        <div
          className={classNames(
            styles.content,
            !isMyMessage && styles.content_reverse,
            images.length && replyMessage.content && styles.content_image_reply,
            images.length && styles.content_image,
            smallMessage && styles.small_message,
          )}
        >
          {replyMessage.chatId && (
            <MessagePreview
              type='message'
              isColor={!isMyMessage}
              className={styles.message_preview}
              message={replyMessage}
            />
          )}
          {images[0] && (
            <img
              onClick={() => {
                setImageLink(images[0]);
                openModal();
              }}
              ref={imageRef}
              className={classNames(styles.image, replyMessage && styles.image_reply, !content && styles.only_image)}
              src={images[0]}
              alt=''
            />
          )}
          <div
            className={classNames(
              styles.content_info,
              images.length && !replyMessage.content && styles.content_info_image,
              !content && styles.empty_content_info,
            )}
          >
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
            <div
              className={classNames(
                styles.message_info,
                !content && styles.empty,
                !isMyMessage && styles.message_info_reverse,
              )}
            >
              <p
                className={classNames(styles.time, !content && styles.time_empty, !isMyMessage && styles.time_my)}
                title={`${formatCreatedTime(createdAt, updatedAt)}`}
              >
                {isEdited && 'edited'} {formattedTime}
              </p>
              {status === 'pending' && <FaRegClock size={12} style={{ marginBottom: '2px' }} />}
              {(status === 'success' || !status) && isMyMessage && <IoCheckmark />}
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
