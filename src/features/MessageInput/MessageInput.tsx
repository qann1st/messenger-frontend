import { ChangeEvent, type FC, FormEvent, KeyboardEvent, memo, useEffect, useRef } from 'react';
import { BsReply } from 'react-icons/bs';
import { HiOutlinePencil } from 'react-icons/hi2';
import { IoSend } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { useMessageStore } from '~/entities';
import {
  Chat,
  ChatWithPagination,
  type Message,
  MessagePreview,
  classNames,
  useInputAutofocus,
  useUserStore,
} from '~/shared';

import styles from './MessageInput.module.css';

import type { TMessageInputProps } from './MessageInput.types';

const MessageInput: FC<TMessageInputProps> = memo(({ recipient }) => {
  const { dialogId } = useParams();

  const { socket, getUser, setUser } = useUserStore();
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

  const queryClient = useQueryClient();

  useInputAutofocus(textAreaRef);

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    if (!inputValue.length) {
      return;
    }

    const formattedMessage = inputValue.trim().replace(/\n/g, '\\n');

    if (formattedMessage.length >= 1 && formattedMessage.length <= 1000) {
      setInputValue('');

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

        const newMessage: Message = {
          chatId: dialogId ?? '',
          content: formattedMessage,
          createdAt: String(newDate),
          updatedAt: String(newDate),
          replyMessage: replyMessage?.id ?? '',
          forwardedMessage: '',
          id: Date.now().toString(),
          isEdited: false,
          sender: user,
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
        }, 10000);

        socket
          ?.emit('message', {
            content: formattedMessage,
            recipient,
            chatId: dialogId,
            replyMessage: replyMessage?.id,
          })
          .on('message', () => {
            clearTimeout(timeout);
            queryClient.setQueryData(['chat', dialogId], (oldData: ChatWithPagination) => {
              const msg = oldData.data.find((m) => m.id === newMessage.id);
              const groupedMsg = oldData.groupedMessages[newDate.toDateString()].find((m) => m.id === newMessage.id);

              if (!msg || !groupedMsg) {
                return;
              }

              msg.status = 'success';
              groupedMsg.status = 'success';

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
