import { FC, memo } from 'react';
import { IoClose } from 'react-icons/io5';

import { TMessagePreviewProps, classNames } from '~/shared';

import styles from './MessagePreview.module.css';

const MessagePreview: FC<TMessagePreviewProps> = memo(
  ({ message, isVisible, onClick, setIsVisible, className, onClose, image, type, icon: Icon, isColor = false }) => (
    <div
      className={classNames(
        className,
        styles.reply,
        isVisible && styles.reply_visible,
        type === 'message' && styles.reply_visible,
        !Icon && styles.pointer,
      )}
      onClick={onClick}
    >
      {type === 'input' && Icon && <Icon size={32} color='var(--message-background)' />}
      {type === 'message' ? (
        <div
          className={classNames(
            styles.reply_content,
            isColor && styles.reply_content_color,
            isColor && styles.reply_content_message_color,
            type === 'message' && styles.reply_content_message,
          )}
        >
          {image && <img draggable={false} src={image} alt='' className={styles.image} />}
          <div className={styles.wrapper}>
            <p
              className={classNames(
                styles.reply_name,
                isColor && styles.reply_text_color,
                type === 'message' && styles.reply_text,
              )}
            >
              {`${message?.sender.firstname} ${message?.sender.lastname}`}
            </p>
            <p className={classNames(styles.reply_text, isColor && styles.reply_text_black)}>
              {message?.voiceMessage && '🎤 Voice message'}
              {message?.content ? message.content.split('\\n').join(' ') : message?.images?.[0] && 'Photo'}
            </p>
          </div>
        </div>
      ) : (
        <div
          className={classNames(
            styles.reply_content,
            isColor && styles.reply_content_color,
            isColor && styles.reply_content_message_color,
          )}
        >
          {image && <img draggable={false} src={image} alt='' className={styles.image} />}
          <div className={styles.wrapper}>
            <p className={classNames(styles.reply_name, isColor && styles.reply_text_color)}>
              {`${message?.sender.firstname} ${message?.sender.lastname}`}
            </p>
            <p className={classNames(styles.reply_text, isColor && styles.reply_text_black)}>
              {message?.voiceMessage && '🎤 Voice message'}
              {message?.content ? message.content.split('\\n').join(' ') : message?.images?.[0] && 'Photo'}
            </p>
          </div>
        </div>
      )}
      {type === 'input' && (
        <button className={styles.close}>
          <IoClose
            cursor='pointer'
            onClick={() => (onClose ? onClose() : setIsVisible && setIsVisible(false))}
            size={32}
          />
        </button>
      )}
    </div>
  ),
);

export { MessagePreview };
