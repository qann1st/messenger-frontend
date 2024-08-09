import type { RefObject } from 'react';

import { User } from '~/shared';

export type TMessagesListProps = {
  recipient?: User;
  scrollRef: RefObject<HTMLDivElement>;
  isLoading: boolean;
};
