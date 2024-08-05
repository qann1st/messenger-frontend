import { ChangeEvent, type FC, FormEvent, KeyboardEvent, memo, useEffect, useRef } from 'react';
import { BsReply } from 'react-icons/bs';
import { GoPaperclip } from 'react-icons/go';
import { HiOutlinePencil } from 'react-icons/hi2';
import { VscSend } from 'react-icons/vsc';
import { useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { useMessageStore } from '~/entities';
import {
  Chat,
  ChatWithPagination,
  type Message,
  MessagePreview,
  classNames,
  messengerApi,
  useInputAutofocus,
  useUserStore,
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
    const dialogId = useParams().dialogId ?? id;

    const { socket, getUser, setUser } = useUserStore();
    const {
      editMessage,
      isVisibleEditMessage,
      replyMessage,
      isVisibleReplyMessage,
      setIsVisibleReplyMessage,
      setIsVisibleEditMessage,
      setEditMessage,
      setReplyMessage,
    } = useMessageStore();
    const { isModalOpen, openModal, closeModal, setFile, setRecipient, setDialogId, setError } =
      useImageSendModalStore();

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const filesInputRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();

    useInputAutofocus(textAreaRef);

    const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
      if (e) {
        e.preventDefault();
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

          const newDate = new Date();
          const dateId = Date.now().toString();

          const newMessage: Message = {
            chatId: dialogId ?? '',
            content: formattedMessage,
            createdAt: String(newDate),
            updatedAt: String(newDate),
            replyMessage: replyMessage?.id ?? '',
            forwardedMessage: '',
            id: dateId,
            isEdited: false,
            sender: user,
            images: [file ?? ''],
            status: 'pending',
          };

          const timeout = setTimeout(() => {
            queryClient.setQueryData(['chat', dialogId], (oldData: ChatWithPagination) => {
              const msg = oldData.data.find((m) => m.id === newMessage.id);
              const groupedMsg = oldData.groupedMessages[newDate.toDateString()].find((m) => m.id === newMessage.id);

              if (!msg || !groupedMsg) {
                return;
              }

              msg.status = 'error';
              groupedMsg.status = 'error';

              return {
                ...oldData,
                data: [...oldData.data, msg],
                groupedMsgs: { ...oldData.groupedMessages, groupedMsg },
              };
            });
          }, 5000);

          socket
            ?.emit('message', {
              content: formattedMessage,
              recipient,
              chatId: dialogId,
              replyMessage: replyMessage?.id,
              images: [file],
            })
            .on('message', (message) => {
              clearTimeout(timeout);
              queryClient.setQueryData(['chat', dialogId], (oldData: ChatWithPagination) => {
                const msg = oldData.data.find((m) => m.id === newMessage.id);
                const groupedMsg = oldData.groupedMessages[newDate.toDateString()].find((m) => m.id === newMessage.id);

                if (!msg || !groupedMsg) {
                  return;
                }

                msg.status = 'success';
                groupedMsg.status = 'success';
                groupedMsg.id = message.id;

                return {
                  ...oldData,
                  data: [...oldData.data, msg],
                  groupedMsgs: { ...oldData.groupedMessages, groupedMsg },
                };
              });
            });

          queryClient.setQueryData(['chat', dialogId], (oldData: ChatWithPagination) => {
            const dialog = user.dialogs.find((d) => d.id === dialogId);

            if (dialog) {
              dialog.messages = [newMessage];
            } else {
              if (newMessage.sender.id !== user?.id) {
                user.dialogs.unshift({
                  id: newMessage.chatId,
                  messages: [newMessage],
                  users: [newMessage.sender, user],
                } as Chat);
              }
            }

            setUser(user);

            let groupedMessages = oldData?.groupedMessages ?? {};
            const date = new Date(newMessage.createdAt).toDateString();
            const arr = groupedMessages[date];

            if (!arr) {
              groupedMessages = { [date]: [newMessage], ...groupedMessages };
            } else {
              arr.unshift(newMessage);
            }

            return {
              ...oldData,
              data: [newMessage, ...(oldData?.data ?? [])],
              total: (oldData?.total ?? 0) + 1,
              groupedMessages,
            };
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
                {haveButtons && (
                  <button onClick={() => filesInputRef.current?.click()} className={styles.icon_button}>
                    <GoPaperclip />
                  </button>
                )}
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
                  <VscSend className={styles.icon} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  },
);

export { MessageInput };
