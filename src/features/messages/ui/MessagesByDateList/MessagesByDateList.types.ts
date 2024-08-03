import type { Message } from '~/shared';

export type TMessagesByDateListProps = {
  groupedMessages: Record<string, Message[]>;
  messages: Message[];
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>, message: Message) => void;
};
