import { type MouseEvent, type MutableRefObject } from 'react';

import type { Message } from '~/shared';

export type TMessagesByDateListProps = {
  messagesRef: MutableRefObject<{
    [key: string]: HTMLDivElement;
  }>;
  onContextMenu: (e: MouseEvent<HTMLDivElement>, message: Message) => void;
  loadMorePages: (page: number) => Promise<void>;
};
