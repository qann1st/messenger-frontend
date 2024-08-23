import type { RefObject } from 'react';

export type TMessagesListProps = {
  scrollRef: RefObject<HTMLDivElement>;
  isLoading: boolean;
};
