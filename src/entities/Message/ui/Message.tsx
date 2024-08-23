import { type FC, memo, useEffect, useRef, useState } from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { BsReplyFill } from 'react-icons/bs';
import { FaRegClock } from 'react-icons/fa';
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5';
import { useShallow } from 'zustand/react/shallow';

import { Waveform, useImageModalStore } from '~/features';
import {
  Avatar,
  MessagePreview,
  Skeleton,
  classNames,
  formatCreatedTime,
  useMobileStore,
  useUserStore,
} from '~/shared';

import styles from './Message.module.css';

import { useMessageStore } from '../model';
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
    message,
    scrollToMessage,
    forwardedMessage,
    voiceLoading = false,
  }) => {
    const { user } = useUserStore();
    const [openModal, setImageLink] = useImageModalStore(useShallow((state) => [state.openModal, state.setImageLink]));
    const [setReplyMessage, setIsVisibleReplyMessage] = useMessageStore(
      useShallow((state) => [state.setReplyMessage, state.setIsVisibleReplyMessage]),
    );
    const { type } = useMobileStore();

    const [x, setX] = useState(0);
    const [startX, setStartX] = useState(0);
    const [isTouched, setIsTouched] = useState(false);

    const messageRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const [smallMessage, setSmallMessage] = useState(false);

    const [isImageLoading, setIsImageLoading] = useState(true);

    const date = new Date(isEdited ? updatedAt : createdAt);

    const timeFormatter = new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit', hour12: false });
    const formattedTime = isNaN(date.getTime()) ? 'Invalid date' : timeFormatter.format(date);

    const isMyMessage = sender?.id === user?.id;

    useEffect(() => {
      if (imageRef.current) {
        if (imageRef.current.width && imageRef.current.width < 150) {
          setSmallMessage(true);
        }
      }
    }, [imageRef.current]);

    return (
      <article
        onTouchStart={(e) => {
          setStartX(e.changedTouches[0].clientX);
          setIsTouched(true);
        }}
        onTouchMove={(e) => {
          const newX = startX - e.changedTouches[0].clientX;
          setX(newX < 64 ? (newX < 0 ? 0 : newX) : 64);
        }}
        onTouchEnd={(e) => {
          if (x > 30) {
            setReplyMessage(message);
            setIsVisibleReplyMessage(true);
          }
          setX(0);
          setIsTouched(false);
        }}
        style={{ transform: `translateX(${-x}px)` }}
        ref={messageRef}
        className={classNames(styles.root, isMyMessage && styles.reverse, !isTouched && styles.root_transition)}
      >
        <BsReplyFill
          style={{ transform: `translateX(${-x}px)` }}
          className={classNames(styles.reply, !isTouched && styles.reply_slide)}
          size={32}
        />
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
          {forwardedMessage.id && (
            <div className={classNames(styles.forward, isMyMessage && styles.forward_my)}>
              <p className={styles.forward_from}>Forwarded from</p>
              <div className={styles.forward_info}>
                <Avatar
                  size='small'
                  firstName={forwardedMessage.sender.firstname}
                  lastName={forwardedMessage.sender.lastname ?? ''}
                />
                <p className={styles.forward_name}>
                  {`${forwardedMessage.sender.firstname} ${forwardedMessage.sender.lastname ?? ''}`}
                </p>
              </div>
            </div>
          )}
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
          {(images[0] || (forwardedMessage.images && forwardedMessage.images[0])) && isImageLoading && (
            <Skeleton.Rectangle borderRadius='var(--border-radius-8)' width={400} height={300} />
          )}
          {(images[0] || (forwardedMessage.images && forwardedMessage.images[0])) && (
            <img
              onClick={() => {
                setImageLink(images[0] ?? forwardedMessage.images[0]);
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
              src={images[0] ?? forwardedMessage.images[0]}
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
            <div
              onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {(content || forwardedMessage.content) &&
                (forwardedMessage.content || content)?.split('\\n').map((line, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <span key={i}>
                    <p className={classNames(styles.text, 'emoji')}>{line}</p>
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
                className={classNames(
                  styles.time,
                  !content && !voiceMessage && styles.time_empty,
                  !isMyMessage && styles.time_my,
                )}
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
      </article>
    );
  },
);

export { Message };
