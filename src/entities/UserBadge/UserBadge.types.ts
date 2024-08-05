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
  showContextMenu?: (e: MouseEvent<HTMLAnchorElement>) => void;
};
