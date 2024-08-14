import type { MouseEvent } from 'react';

import { Chat } from '~/shared';

export type TUserBadgeProps = {
  firstName?: string;
  lastName?: string;
  lastMessage?: string;
  isActive: boolean;
  href?: string;
  isOnline?: boolean;
  isForward?: boolean;
  dialog?: Chat;
  isSearch?: boolean;
  hasForwardedMessage?: boolean;
  userId?: string;
  lastMessageImage?: string[];
  lastMessageVoice?: string;
  printing?: boolean;
  unreadedMessages: number;
  onClick?: (chat: Chat) => void;
  showContextMenu?: (e: MouseEvent<HTMLAnchorElement>) => void;
};
