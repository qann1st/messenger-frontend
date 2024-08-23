import { DragEvent, type FC, RefObject, memo, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { useQuery } from '@tanstack/react-query';

import {
  ForwardMessageModal,
  ImageModal,
  ImageSendModal,
  MessageInput,
  MessagesList,
  UserInfo,
  useMessageInputStore,
} from '~/features';
import {
  User,
  classNames,
  getRecipientFromUsers,
  groupMessagesByDate,
  messengerApi,
  useMobileStore,
  useUserStore,
} from '~/shared';

import styles from './Chat.module.css';

const Chat: FC = () => {
  const { user } = useUserStore();
  const { type, lastChat, setLastChat } = useMobileStore();
  const setIsDragging = useMessageInputStore(useShallow((state) => state.setIsDragging));

  const params = useParams();
  const dialogId = params.dialogId ?? (type !== 'desktop' ? lastChat : '');
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ['chat', dialogId],
    queryFn: async () => {
      const messages = await messengerApi.getChatMessages(dialogId);
      return { ...messages, groupedMessages: groupMessagesByDate(messages.data) };
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLastChat(params.dialogId ?? '');
  }, []);

  useEffect(() => {
    if (error) {
      navigate('/');
    }
  }, [error]);

  useEffect(() => {
    if (!data || !user) {
      return;
    }

    const recipientUser = getRecipientFromUsers(data.users ?? [], user.id);

    document.title = `${recipientUser?.firstname} ${recipientUser?.lastname}`;

    return () => {
      document.title = 'Messenger';
    };
  }, [user, data]);

  const recipient = useMemo(
    () => getRecipientFromUsers(user?.dialogs.find((el) => el.id === dialogId)?.users ?? [], user?.id ?? ''),
    [data, user],
  );

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  return (
    <>
      <main
        ref={chatRef}
        className={classNames(styles.root, styles[type], !params.dialogId && styles.slide)}
        onDragOver={handleDragOver}
      >
        <UserInfo hasAvatar recipient={recipient} printing={data?.printing ?? false} />
        <Ggg isLoading={isLoading} scrollRef={scrollRef} />
        <Fff scrollRef={scrollRef} recipient={recipient} />
      </main>
      <ForwardMessageModal />
      <ImageSendModal />
      <ImageModal />
    </>
  );
};

export { Chat };

const Ggg: FC<{ scrollRef: RefObject<HTMLDivElement>; isLoading: boolean }> = memo(({ isLoading, scrollRef }) => (
  <div className={classNames(styles.background)}>
    <MessagesList isLoading={isLoading} scrollRef={scrollRef} />
  </div>
));

const Fff: FC<{ recipient?: User; scrollRef?: RefObject<HTMLDivElement> }> = memo(({ recipient, scrollRef }) => {
  const { inputValue, setInputValue, addInputValue } = useMessageInputStore();

  return (
    <MessageInput
      inputValue={inputValue}
      scrollRef={scrollRef}
      setInputValue={setInputValue}
      addInputValue={addInputValue}
      recipient={recipient?.id ?? ''}
    />
  );
});
