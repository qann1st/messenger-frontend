import { type FC, memo, useEffect, useRef, useState } from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { FaRegClock } from 'react-icons/fa';
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5';

import { Waveform, useImageModalStore } from '~/features';
import {
  Avatar,
  MessagePreview,
  Skeleton,
  classNames,
  formatCreatedTime,
  highlightMessage,
  useMobileStore,
  useUserStore,
} from '~/shared';

import styles from './Message.module.css';

import { TMessageProps } from './Message.types';

const Message: FC<TMessageProps> = memo(
  ({
    sender,
    content,
    isEdited,
    updatedAt,
    replyMessage,
    hasAvatar,
    voiceMessage,
    readed,
    createdAt,
    images,
    status,
    scrollToMessage,
    voiceLoading = false,
  }) => {
    const { user } = useUserStore();
    const { openModal, setImageLink } = useImageModalStore();
    const { type } = useMobileStore();

    const messageRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const [smallMessage, setSmallMessage] = useState(false);

    const [isImageLoading, setIsImageLoading] = useState(!!images[0]);

    const date = new Date(isEdited ? updatedAt : createdAt);

    const timeFormatter = new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit', hour12: false });
    const formattedTime = timeFormatter.format(date);

    const isMyMessage = sender.id === user?.id;

    useEffect(() => {
      if (imageRef.current) {
        if (imageRef.current.width && imageRef.current.width < 150) {
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
            images[0] && replyMessage.content && styles.content_image_reply,
            images[0] && styles.content_image,
            smallMessage && styles.small_message,
          )}
        >
          {replyMessage.images && (
            <MessagePreview
              type='message'
              onClick={() => scrollToMessage(replyMessage.id)}
              isColor={!isMyMessage}
              className={classNames(
                styles.message_preview,
                images[0] && styles.message_preview_reply,
                voiceMessage && styles.message_preview_voice,
              )}
              message={replyMessage}
              image={replyMessage.images[0]}
            />
          )}
          {!voiceLoading && voiceMessage && <Waveform isMyMessage={isMyMessage} src={voiceMessage} />}
          {voiceLoading && voiceMessage && (
            <div className={styles.skeleton}>
              <Skeleton.Circle />
              <div className={styles.skeleton_text}>
                <Skeleton.Rectangle width={140} height={25} />
                <Skeleton.Rectangle width={40} height={15} />
              </div>
            </div>
          )}
          {isImageLoading && <Skeleton.Rectangle borderRadius='var(--border-radius-8)' width={400} height={300} />}
          {images[0] && (
            <img
              onClick={() => {
                setImageLink(images[0]);
                openModal();
              }}
              onLoad={() => setIsImageLoading(false)}
              ref={imageRef}
              className={classNames(
                styles.image,
                replyMessage.id && styles.image_reply,
                replyMessage.id && !content && styles.image_radius,
                !replyMessage.id && !content && styles.image_circle,
                !content && styles.only_image,
                type === 'mobile' && styles.image_mobile,
                !isImageLoading && styles.image_loaded,
              )}
              src={images[0]}
              alt=''
            />
          )}
          <div
            className={classNames(
              styles.content_info,
              images[0] && styles.content_info_image,
              !content && styles.empty_content_info,
            )}
          >
            <div>
              {content?.split('\\n').map((line, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <span key={i}>
                  <p
                    className={styles.text}
                    dangerouslySetInnerHTML={{ __html: highlightMessage(line, styles, isMyMessage) }}
                  />
                  {line === '' && <br />}
                </span>
              ))}
            </div>
            <div
              className={classNames(
                styles.message_info,
                !content && images[0] && styles.empty,
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
              {(status === 'success' || !status) &&
                isMyMessage &&
                (readed.length >= 2 && readed.includes(user.id) ? <IoCheckmarkDone /> : <IoCheckmark />)}
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
