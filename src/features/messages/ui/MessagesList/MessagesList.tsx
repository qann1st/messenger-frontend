import { type FC, type MouseEvent, memo, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { useMessageStore } from '~/entities';
import { ScrollToBottomButton, useMessageInputStore } from '~/features';
import { Message, Skeleton, useMessagePagination } from '~/shared';

import styles from './MessagesList.module.css';

import { MessagesByDateList } from '../MessagesByDateList';
import { MessagesListLayout, useOkStore } from '../MessagesListLayout';
import type { TMessagesListProps } from './MessagesList.types';

const MessagesList: FC<TMessagesListProps> = memo(({ scrollRef, isLoading }) => {
  const { setReplyMessage, setIsVisibleReplyMessage, setSelectedMessage, setEditMessage, setIsVisibleEditMessage } =
    useMessageStore();
  const setInputValue = useMessageInputStore((state) => state.setInputValue);
  const callback = useOkStore(useShallow((state) => state.callback));

  const { dialogId } = useParams();

  const messagesRef = useRef<{ [key: string]: HTMLDivElement }>({});

  const { loadMorePages } = useMessagePagination(dialogId, scrollRef);

  useEffect(() => {
    setInputValue('');
    setEditMessage(null);
    setReplyMessage(null);
    setIsVisibleEditMessage(false);
    setIsVisibleReplyMessage(false);
    setSelectedMessage(null);
  }, [dialogId]);

  const handleContextMenu = useCallback(
    (e: MouseEvent<HTMLDivElement>, message: Message) => {
      setSelectedMessage(message);
      callback(e);
    },
    [callback],
  );

  if (isLoading) {
    return (
      <div className={styles.skeletons}>
        {new Array(Math.trunc(window.innerHeight * 0.015)).fill(null).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} style={{ alignSelf: Math.random() > 0.5 ? 'flex-end' : 'flex-start' }}>
            <Skeleton.Rectangle width={200} height={46} borderRadius='var(--border-radius-8)' />
          </div>
        ))}
      </div>
    );
  }

  return (
    <MessagesListLayout isLoading={isLoading} scrollRef={scrollRef}>
      <MessagesByDateList
        loadMorePages={loadMorePages}
        scrollRef={scrollRef}
        messagesRef={messagesRef}
        onContextMenu={handleContextMenu}
        onClick={handleContextMenu}
      />
      <ScrollToBottomButton scrollRef={scrollRef} />
    </MessagesListLayout>
  );
});

export { MessagesList };
