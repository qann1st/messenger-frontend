import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { ChangeEvent, ClipboardEvent, type FC, KeyboardEvent, memo, useCallback, useRef } from 'react';
import { BsReply, BsTrash } from 'react-icons/bs';
import { FaRegFaceSmile } from 'react-icons/fa6';
import { GoPaperclip } from 'react-icons/go';
import { HiOutlinePencil } from 'react-icons/hi';
import { MdOutlineKeyboardVoice } from 'react-icons/md';
import { PiShareFat } from 'react-icons/pi';
import { VscSend } from 'react-icons/vsc';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { useMessageStore } from '~/entities';
import {
  type Message,
  MessagePreview,
  classNames,
  formatMilliseconds,
  messengerApi,
  useEscCloseModal,
  useFocusOnMount,
  useMobileStore,
  useOutsideClick,
  useRecordAudio,
  useSendMessage,
  useTextareaAutoResize,
  useThemeStore,
} from '~/shared';

import styles from './MessageInput.module.css';

import { useImageSendModalStore } from '../ImageSendModal';
import type { TMessageInputProps } from './MessageInput.types';
import { useMessageInputStore } from './model';

const MessageInput: FC<TMessageInputProps> = memo(
  ({
    recipient,
    dialogId: id,
    inputValue,
    setInputValue,
    addInputValue,
    file,
    scrollRef,
    isDisabled = false,
    haveButtons = true,
    type = 'absolute',
  }) => {
    const [setFile, setRecipient, setDialogId, openModal, setError, setImageInputValue] = useImageSendModalStore(
      useShallow((state) => [
        state.setFile,
        state.setRecipient,
        state.setDialogId,
        state.openModal,
        state.setError,
        state.setInputValue,
      ]),
    );

    const dialogId = useParams().dialogId ?? id;

    const [
      isVisibleReplyMessage,
      isVisibleEditMessage,
      editMessage,
      setIsVisibleEditMessage,
      replyMessage,
      setIsVisibleReplyMessage,
      isVisibleForwardMessage,
      forwardMessage,
      setIsVisibleForwardMessage,
    ] = useMessageStore(
      useShallow((state) => [
        state.isVisibleReplyMessage,
        state.isVisibleEditMessage,
        state.editMessage,
        state.setIsVisibleEditMessage,
        state.replyMessage,
        state.setIsVisibleReplyMessage,
        state.isVisibleForwardMessage,
        state.forwardMessage,
        state.setIsVisibleForwardMessage,
      ]),
    );

    const { isDragging, setIsDragging } = useMessageInputStore();

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const filesInputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);

    const { theme } = useThemeStore();

    const { isRecording, handleStartRecording, handleCancelRecording } = useRecordAudio(recipient);
    const { handleSubmit, timer, setIsPrinting, isVisibleEmojiPicker, setIsVisibleEmojiPicker } = useSendMessage(
      dialogId,
      recipient,
      file,
      isRecording,
      inputValue,
      setInputValue,
      handleCancelRecording,
      scrollRef,
    );
    const { type: deviceType } = useMobileStore();

    useTextareaAutoResize(textAreaRef, inputValue);
    useOutsideClick(emojiRef, () => setIsVisibleEmojiPicker(false), true, buttonRef);
    useEscCloseModal(() => setIsVisibleEmojiPicker(false));
    useFocusOnMount(textAreaRef);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (
        e.key === 'Enter' &&
        !e.shiftKey &&
        (inputValue.length || forwardMessage || type === 'not-absolute') &&
        !isDisabled &&
        deviceType !== 'desktop'
      ) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!isRecording && !isDisabled && !forwardMessage?.chatId) {
          setIsPrinting(true);
          setInputValue(e.target.value);
        }
      },
      [isRecording, isDisabled, forwardMessage],
    );

    const uploadFile = (files: File) => {
      if (isRecording || !files || !files.type.includes('image') || files.type.includes('image/svg')) {
        return;
      }
      setFile({ type: files.type, url: '' });
      setRecipient('');
      setDialogId('');
      openModal();
      setImageInputValue(inputValue);
      setInputValue('');
      messengerApi
        .uploadFile(files)
        .then((data) => {
          setFile({ url: data[0], type: files.type });
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
      if (e.clipboardData.files.length > 0) {
        uploadFile(e.clipboardData.files[0]);
      }
    };

    return (
      <>
        {isDragging && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              uploadFile(e.dataTransfer.files[0]);
              setIsDragging(false);
            }}
            className={classNames(styles.drag_drop, isDragging && styles.drag_drop_active)}
          />
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isDisabled) {
              handleSubmit();
            }
          }}
          className={classNames(styles.root, styles[type])}
        >
          <input
            onChange={handleFileUpload}
            className={styles.files_input}
            type='file'
            accept='image/*'
            ref={filesInputRef}
          />
          <div className={styles.content}>
            <div
              style={{
                height: isVisibleEditMessage || isVisibleReplyMessage || isVisibleForwardMessage ? '118px' : '50px',
              }}
              className={classNames(styles.wrapper, isVisibleReplyMessage && styles.wrapper_reply)}
            >
              {isVisibleForwardMessage && forwardMessage && (
                <MessagePreview
                  isColor
                  message={forwardMessage ?? ({} as Message)}
                  isVisible={isVisibleForwardMessage}
                  setIsVisible={setIsVisibleForwardMessage}
                  type='input'
                  icon={PiShareFat}
                  className={classNames(styles.preview)}
                />
              )}
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
                  placeholder={isRecording ? 'Recording...' : 'Message'}
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
                    onClick={() => {
                      if (handleCancelRecording) {
                        handleCancelRecording();
                      }
                    }}
                  >
                    <VscSend className={styles.icon} />
                  </button>
                )}
                {isVisibleEmojiPicker && (
                  <div className={styles.emoji_picker} ref={emojiRef}>
                    <EmojiPicker
                      lazyLoadEmojis
                      theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
                      emojiStyle={EmojiStyle.GOOGLE}
                      onEmojiClick={(e) => addInputValue(e.emoji)}
                    />
                  </div>
                )}
                {!isRecording && !isVisibleForwardMessage && (
                  <button
                    className={styles.icon_button}
                    onClick={() => setIsVisibleEmojiPicker((prev) => !prev)}
                    type='button'
                    ref={buttonRef}
                  >
                    <FaRegFaceSmile size={24} className={styles.icon} />
                  </button>
                )}
                {inputValue.length === 0 && !isRecording && !isVisibleForwardMessage && type === 'absolute' && (
                  <button className={styles.icon_button} onClick={() => handleStartRecording()} type='button'>
                    <MdOutlineKeyboardVoice size={24} className={styles.icon} />
                  </button>
                )}
                {((inputValue.length !== 0 && !isRecording) || type !== 'absolute' || isVisibleForwardMessage) && (
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
