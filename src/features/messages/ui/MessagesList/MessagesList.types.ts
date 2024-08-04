import type { RefObject } from 'react';

import { ChatWithPagination, Message, User } from '~/shared';

export type TMessagesListProps = {
  groupedMessages?: ChatWithPagination['groupedMessages'];
  recipient?: User;
  messages?: Message[];
  scrollRef: RefObject<HTMLDivElement>;
  isLoading: boolean;
};
