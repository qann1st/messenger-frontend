import type { MouseEvent } from 'react';

export type TUserBadgeProps = {
  firstName?: string;
  lastName?: string;
  lastMessage?: string;
  isActive: boolean;
  href?: string;
  isOnline?: boolean;
  isSearch?: boolean;
  userId?: string;
  lastMessageImage?: string[];
  lastMessageVoice?: string;
  printing?: boolean;
  unreadedMessages: number;
  showContextMenu?: (e: MouseEvent<HTMLAnchorElement>) => void;
};
