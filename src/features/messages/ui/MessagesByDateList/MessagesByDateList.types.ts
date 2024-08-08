import { MouseEvent } from 'react';

import type { Message } from '~/shared';

export type TMessagesByDateListProps = {
  onContextMenu: (e: MouseEvent<HTMLDivElement>, message: Message) => void;
};
