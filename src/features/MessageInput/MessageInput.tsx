import { ChangeEvent, type FC, FormEvent, KeyboardEvent, memo, useEffect, useRef, useState } from 'react';
import { BsReply, BsTrash } from 'react-icons/bs';
import { GoPaperclip } from 'react-icons/go';
import { HiOutlinePencil } from 'react-icons/hi2';
import { MdOutlineKeyboardVoice } from 'react-icons/md';
import { VscSend } from 'react-icons/vsc';
import { useParams } from 'react-router-dom';

import { useMessageStore } from '~/entities';
import { type Message, MessagePreview, classNames, formatMilliseconds, messengerApi, useUserStore } from '~/shared';

import styles from './MessageInput.module.css';

import { useImageSendModalStore } from '../ImageSendModal';
import type { TMessageInputProps } from './MessageInput.types';

const MessageInput: FC<TMessageInputProps> = memo(
  ({
    recipient,
    dialogId: id,
    inputValue,
    setInputValue,
    file,
    isVoice,
    onStopRecording,
    onCancelRecording,
    isDisabled = false,
    haveButtons = true,
    type = 'absolute',
  }) => {
    const dialogId = useParams().dialogId ?? id;

    const { socket, getUser } = useUserStore();
    const {
      editMessage,
      isVisibleEditMessage,
      replyMessage,
      setIsAudioMessage,
      isVisibleReplyMessage,
      setIsVisibleReplyMessage,
      setIsVisibleEditMessage,
      setEditMessage,
      setReplyMessage,
    } = useMessageStore();
    const { isModalOpen, openModal, closeModal, setFile, setRecipient, setDialogId, setError } =
      useImageSendModalStore();

    const [timer, setTimer] = useState(0);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const filesInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
      if (e) {
        e.preventDefault();
      }

      if (isVoice && onStopRecording) {
        onStopRecording();
        return;
      }

      if ((!inputValue.length && !isModalOpen) || isDisabled) {
        return;
      }

      const formattedMessage = inputValue.trim().replace(/\n/g, '\\n');

      if ((formattedMessage.length >= 1 && formattedMessage.length <= 1000) || isModalOpen) {
        setInputValue('');

        if (isModalOpen) {
          closeModal();
        }

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
          const user = getUser();

          if (!user) {
            return;
          }

          socket?.emit('message', {
            content: formattedMessage,
            recipient,
            chatId: dialogId,
            replyMessage: replyMessage?.id,
            images: file ? [file] : [],
          });

          setReplyMessage(null);
          setIsVisibleReplyMessage(false);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (isVoice) {
        return;
      }

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
    }, [isVisibleEditMessage, isVisibleReplyMessage]);

    useEffect(() => {
      if (isVoice) {
        const timeout = setInterval(() => {
          setTimer((prev) => prev + 10);
        }, 10);

        return () => {
          clearTimeout(timeout);
        };
      }
    }, []);

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFile('');
        setRecipient('');
        setDialogId('');
        openModal();
        messengerApi
          .uploadFile(e.target.files[0])
          .then((data) => {
            setFile(data[0]);
            setRecipient(recipient);
            setDialogId(dialogId ?? '');
            if (textAreaRef.current) {
              textAreaRef.current.blur();
            }
          })
          .catch(() => {
            setError('File too large');
          });
      }
    };

    return (
      <>
        <form onSubmit={handleSubmit} className={classNames(styles.root, styles[type])}>
          <input
            onChange={handleFileUpload}
            className={styles.files_input}
            type='file'
            accept='image/*'
            ref={filesInputRef}
          />
          <div className={styles.content}>
            <div className={classNames(styles.wrapper, isVisibleReplyMessage && styles.wrapper_reply)}>
              {isVisibleEditMessage && editMessage && (
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
                  image={editMessage.images?.[0]}
                />
              )}
              {isVisibleReplyMessage && replyMessage && (
                <MessagePreview
                  isColor
                  message={replyMessage ?? ({} as Message)}
                  isVisible={isVisibleReplyMessage}
                  setIsVisible={setIsVisibleReplyMessage}
                  type='input'
                  icon={BsReply}
                  image={replyMessage.images?.[0]}
                  className={classNames(styles.preview)}
                />
              )}
              <div className={styles.input_wrapper}>
                {haveButtons && !isVoice && (
                  <button type='button' className={styles.icon_button}>
                    <GoPaperclip className={styles.paper_clip} />
                  </button>
                )}
                <textarea
                  style={{ height: '50px' }}
                  placeholder='Message'
                  value={inputValue}
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                  className={classNames(
                    styles.input,
                    isVisibleReplyMessage && styles.input_reply,
                    isVoice && styles.input_voice,
                    type === 'not-absolute' && styles.input_not_absolute,
                  )}
                  ref={textAreaRef}
                  rows={inputValue.includes('\n') ? 2 : 1}
                  maxLength={1000}
                />
                {isVoice && type === 'absolute' && isVoice && (
                  <div className={styles.record_info}>
                    <div className={styles.recording} />
                    <p>{formatMilliseconds(timer)}</p>
                    <button
                      className={styles.icon_button}
                      onClick={() => {
                        if (onCancelRecording) {
                          onCancelRecording();
                        }
                        setIsAudioMessage(false);
                      }}
                    >
                      <BsTrash size={24} className={classNames(styles.icon, styles.button_delete)} />
                    </button>
                  </div>
                )}
                {isVoice && type === 'absolute' && (
                  <button
                    type='button'
                    className={styles.icon_button}
                    onClick={async () => {
                      if (onStopRecording) {
                        onStopRecording();
                      }
                    }}
                  >
                    <VscSend className={styles.icon} />
                  </button>
                )}
                {inputValue.length === 0 && !isVoice && type === 'absolute' && (
                  <button className={styles.icon_button} onClick={() => setIsAudioMessage(true)} type='button'>
                    <MdOutlineKeyboardVoice size={24} className={styles.icon} />
                  </button>
                )}
                {((inputValue.length !== 0 && !isVoice) || type !== 'absolute') && (
                  <button className={styles.icon_button} type='submit'>
                    <VscSend className={styles.icon} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </>
    );
  },
);

export { MessageInput };
