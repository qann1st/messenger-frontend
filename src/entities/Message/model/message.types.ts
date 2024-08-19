import type { Message } from '~/shared';

export type TMessageState = {
  selectedMessage: Message | null;
  selectedMessages: Message[];
  forwardMessage: Message | null;
  isVisibleReplyMessage: boolean;
  isVisibleForwardMessage: boolean;
  isVisibleEditMessage: boolean;
  replyMessage: Message | null;
  editMessage: Message | null;
  setForwardMessage: (message: Message | null) => void;
  setIsVisibleForwardMessage: (isVisible: boolean) => void;
  addSelectedMessages: (message: Message) => void;
  setSelectedMessage: (messageId: Message | null) => void;
  setReplyMessage: (message: Message | null) => void;
  setIsVisibleReplyMessage: (isVisible: boolean) => void;
  setIsVisibleEditMessage: (isVisible: boolean) => void;
  setEditMessage: (message: Message | null) => void;
  getReplyMessage: () => TMessageState['replyMessage'];
};
