import { type ReactNode, type RefObject } from 'react';

export type TMessagesListLayoutProps = {
  scrollRef: RefObject<HTMLDivElement>;
  children: ReactNode;
  isLoading: boolean;
};
