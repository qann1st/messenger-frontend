import { ChangeEvent, type FC, FormEvent, KeyboardEvent, memo, useEffect, useRef } from 'react';
import { BsReply } from 'react-icons/bs';
import { HiOutlinePencil } from 'react-icons/hi2';
import { IoSend } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

import { useMessageStore } from '~/entities';
import { type Message, MessagePreview, classNames, useUserStore } from '~/shared';

import styles from './MessageInput.module.css';

import type { TMessageInputProps } from './MessageInput.types';

const MessageInput: FC<TMessageInputProps> = memo(({ recipient }) => {
  const { dialogId } = useParams();

  const { socket } = useUserStore();
  const {
    editMessage,
    isVisibleEditMessage,
    replyMessage,
    isVisibleReplyMessage,
    setIsVisibleReplyMessage,
    setIsVisibleEditMessage,
    inputValue,
    setInputValue,
    setEditMessage,
    setReplyMessage,
  } = useMessageStore();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    if (!inputValue.length) {
      return;
    }

    const formattedMessage = inputValue.trim().replace(/\n/g, '\\n');

    if (formattedMessage.length >= 1 && formattedMessage.length <= 1000) {
      if (editMessage && isVisibleEditMessage) {
        socket?.emit('edit-message', {
          messageId: editMessage.id,
          roomId: editMessage.chatId,
          content: formattedMessage,
          recipient,
        });
        setEditMessage(null);
        setIsVisibleEditMessage(false);
      } else {
        socket?.emit('message', {
          content: formattedMessage,
          recipient,
          chatId: dialogId,
          replyMessage: replyMessage?.id,
        });
        setReplyMessage(null);
        setIsVisibleReplyMessage(false);
      }

      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    if (!textAreaRef.current) {
      return;
    }

    if (inputValue.includes('\\n')) {
      textAreaRef.current.value = inputValue.split('\\n').join('\n');
      setInputValue(inputValue.split('\\n').join('\n'));
    }

    const newLines = inputValue.split(/\n/).length - 1;

    const height = 22 * newLines + 50;

    textAreaRef.current.style.height = `${height > 94 ? 94 : height}px`;
  }, [inputValue]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [inputValue, isVisibleEditMessage, isVisibleReplyMessage]);

  return (
    <form onSubmit={handleSubmit} className={styles.root}>
      <div className={styles.content}>
        <div className={classNames(styles.wrapper, isVisibleReplyMessage && styles.wrapper_reply)}>
          {isVisibleEditMessage && (
            <MessagePreview
              isColor
              message={editMessage ?? ({} as Message)}
              isVisible={isVisibleEditMessage}
              setIsVisible={setIsVisibleEditMessage}
              onClose={() => {
                setIsVisibleEditMessage(false);
                setInputValue('');
              }}
              type='input'
              icon={HiOutlinePencil}
              className={classNames(styles.preview)}
            />
          )}
          {isVisibleReplyMessage && (
            <MessagePreview
              isColor
              message={replyMessage ?? ({} as Message)}
              isVisible={isVisibleReplyMessage}
              setIsVisible={setIsVisibleReplyMessage}
              type='input'
              icon={BsReply}
              className={classNames(styles.preview)}
            />
          )}
          <div className={styles.input_wrapper}>
            <textarea
              style={{ height: '50px' }}
              placeholder='Message'
              value={inputValue}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              className={classNames(styles.input, isVisibleReplyMessage && styles.input_reply)}
              ref={textAreaRef}
              rows={inputValue.includes('\n') ? 2 : 1}
              maxLength={1000}
            />
            <button className={styles.button} type='submit'>
              <IoSend className={styles.icon} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
});

export { MessageInput };
