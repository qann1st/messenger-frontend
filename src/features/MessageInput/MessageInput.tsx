import { ChangeEvent, ClipboardEvent, type FC, KeyboardEvent, memo, useCallback, useRef } from 'react';
import { BsReply, BsTrash } from 'react-icons/bs';
import { GoPaperclip } from 'react-icons/go';
import { HiOutlinePencil } from 'react-icons/hi';
import { MdOutlineKeyboardVoice } from 'react-icons/md';
import { VscSend } from 'react-icons/vsc';
import { useParams } from 'react-router-dom';

import { useMessageStore } from '~/entities';
import {
  type Message,
  MessagePreview,
  classNames,
  formatMilliseconds,
  messengerApi,
  useFocusOnMount,
  useRecordAudio,
  useSendMessage,
  useTextareaAutoResize,
} from '~/shared';

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
    isDisabled = false,
    haveButtons = true,
    type = 'absolute',
  }) => {
    const {
      setFile,
      setRecipient,
      setDialogId,
      openModal,
      setError,
      setInputValue: setImageInputValue,
    } = useImageSendModalStore();

    const dialogId = useParams().dialogId ?? id;

    const {
      isVisibleReplyMessage,
      isVisibleEditMessage,
      editMessage,
      setIsVisibleEditMessage,
      replyMessage,
      setIsVisibleReplyMessage,
    } = useMessageStore();

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const filesInputRef = useRef<HTMLInputElement>(null);

    const { isRecording, handleStartRecording, handleStopRecording, handleCancelRecording } = useRecordAudio(recipient);
    const { handleSubmit, timer } = useSendMessage(
      dialogId,
      recipient,
      file,
      isRecording,
      inputValue,
      setInputValue,
      handleStopRecording,
    );

    useTextareaAutoResize(textAreaRef, inputValue);
    useFocusOnMount(textAreaRef);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!isRecording || !isDisabled) {
          setInputValue(e.target.value);
        }
      },
      [isRecording, isDisabled],
    );

    const uploadFile = (files: File) => {
      if (isRecording) {
        return;
      }

      setFile('');
      setRecipient('');
      setDialogId('');
      openModal();
      setImageInputValue(inputValue);
      setInputValue('');
      messengerApi
        .uploadFile(files)
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
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        uploadFile(e.target.files[0]);
      }
    };

    const handleClipboard = (e: ClipboardEvent<HTMLTextAreaElement>) => {
      if (e.clipboardData.files) {
        uploadFile(e.clipboardData.files[0]);
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
                {haveButtons && !isRecording && (
                  <button type='button' onClick={() => filesInputRef.current?.click()} className={styles.icon_button}>
                    <GoPaperclip className={styles.paper_clip} />
                  </button>
                )}
                <textarea
                  style={{ height: '50px' }}
                  placeholder='Message'
                  value={inputValue}
                  onKeyDown={handleKeyDown}
                  onPaste={handleClipboard}
                  onChange={handleChange}
                  className={classNames(
                    styles.input,
                    isVisibleReplyMessage && styles.input_reply,
                    isRecording && styles.input_voice,
                    type === 'not-absolute' && styles.input_not_absolute,
                  )}
                  ref={textAreaRef}
                  rows={inputValue.includes('\n') ? 2 : 1}
                  maxLength={1000}
                />
                {isRecording && type === 'absolute' && isRecording && (
                  <div className={styles.record_info}>
                    <div className={styles.recording} />
                    <p>{formatMilliseconds(timer)}</p>
                    <button
                      className={styles.icon_button}
                      onClick={() => {
                        if (handleCancelRecording) {
                          handleCancelRecording();
                        }
                      }}
                    >
                      <BsTrash size={24} className={classNames(styles.icon, styles.button_delete)} />
                    </button>
                  </div>
                )}
                {isRecording && type === 'absolute' && (
                  <button
                    type='button'
                    className={styles.icon_button}
                    onClick={async () => {
                      if (handleStopRecording) {
                        handleStopRecording();
                      }
                    }}
                  >
                    <VscSend className={styles.icon} />
                  </button>
                )}
                {inputValue.length === 0 && !isRecording && type === 'absolute' && (
                  <button className={styles.icon_button} onClick={() => handleStartRecording()} type='button'>
                    <MdOutlineKeyboardVoice size={24} className={styles.icon} />
                  </button>
                )}
                {((inputValue.length !== 0 && !isRecording) || type !== 'absolute') && (
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
