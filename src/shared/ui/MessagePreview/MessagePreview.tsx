import { FC, memo } from 'react';
import { IoClose } from 'react-icons/io5';

import { TMessagePreviewProps, classNames } from '~/shared';

import styles from './MessagePreview.module.css';

const MessagePreview: FC<TMessagePreviewProps> = memo(
  ({ message, isVisible, setIsVisible, className, onClose, image, type, icon: Icon, isColor = false }) => (
    <div
      className={classNames(
        className,
        styles.reply,
        isVisible && styles.reply_visible,
        type === 'message' && styles.reply_visible,
      )}
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
          <div>
            <p
              className={classNames(
                styles.reply_name,
                isColor && styles.reply_text_color,
                type === 'message' && styles.reply_text,
              )}
            >
              {message?.sender.firstname}
            </p>
            <p className={classNames(styles.reply_text, isColor && styles.reply_text_black)}>
              {message?.content ? message.content.split('\\n').join(' ') : 'Photo'}
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
          <div>
            <p className={classNames(styles.reply_name, isColor && styles.reply_text_color)}>
              {message?.sender.firstname}
            </p>
            <p className={classNames(styles.reply_text, isColor && styles.reply_text_black)}>
              {message?.content ? message.content.split('\\n').join(' ') : 'Photo'}
            </p>
          </div>
        </div>
      )}
      {type === 'input' && (
        <IoClose
          cursor='pointer'
          onClick={() => (onClose ? onClose() : setIsVisible && setIsVisible(false))}
          size={32}
          color='var(--message-background)'
        />
      )}
    </div>
  ),
);

export { MessagePreview };
