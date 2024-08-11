import { type MouseEvent, type MutableRefObject, RefObject } from 'react';

import type { Message } from '~/shared';

export type TMessagesByDateListProps = {
  messagesRef: MutableRefObject<{
    [key: string]: HTMLDivElement;
  }>;
  scrollRef: RefObject<HTMLDivElement>;
  onContextMenu: (e: MouseEvent<HTMLDivElement>, message: Message) => void;
};
