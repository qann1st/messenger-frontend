import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useMessageStore } from '~/entities';
import { classNames, useMessagesListSize } from '~/shared';

import styles from './MessagesListLayout.module.css';

import { TMessagesListLayoutProps } from './MessagesListLayout.types';

const MessagesListLayout: FC<TMessagesListLayoutProps> = ({ children, scrollRef, isLoading }) => {
  const [isVisibleReplyMessage, isVisibleEditMessage] = useMessageStore(
    useShallow((state) => [state.isVisibleReplyMessage, state.isVisibleEditMessage]),
  );

  const messagesListStyles = useMessagesListSize(styles);

  return (
    <div
      className={classNames(
        styles.root,
        (isVisibleReplyMessage || isVisibleEditMessage) && styles.root_reply,
        isLoading && styles.pad,
        messagesListStyles,
      )}
      ref={scrollRef}
    >
      {children}
    </div>
  );
};
export { MessagesListLayout };
