import { MouseEvent } from 'react';

import type { Message } from '~/shared';

export type TMessagesByDateListProps = {
  groupedMessages: Record<string, Message[]>;
  messages: Message[];
  onContextMenu: (e: MouseEvent<HTMLDivElement>, message: Message) => void;
};
