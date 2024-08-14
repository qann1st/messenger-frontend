import { FC } from 'react';

import { classNames, useMessagesListSize } from '~/shared';

import styles from './MessagesListLayout.module.css';

import { TMessagesListLayoutProps } from './MessagesListLayout.types';

const MessagesListLayout: FC<TMessagesListLayoutProps> = ({ children, scrollRef, isLoading }) => (
  <div className={classNames(useMessagesListSize(styles), styles.root, isLoading && styles.pad)} ref={scrollRef}>
    {children}
  </div>
);

export { MessagesListLayout };
