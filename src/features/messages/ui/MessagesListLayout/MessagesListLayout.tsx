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

  return (
    <div
      className={classNames(
        useMessagesListSize(styles),
        styles.root,
        (isVisibleReplyMessage || isVisibleEditMessage) && styles.root_reply,
        isLoading && styles.pad,
      )}
      ref={scrollRef}
    >
      {children}
    </div>
  );
};
export { MessagesListLayout };
