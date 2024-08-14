import type { Message } from '~/shared';

export type TMessageState = {
  selectedMessage: Message | null;
  forwardMessage: Message | null;
  isVisibleReplyMessage: boolean;
  isVisibleForwardMessage: boolean;
  isVisibleEditMessage: boolean;
  replyMessage: Message | null;
  editMessage: Message | null;
  otherInputFocus: boolean;
  setForwardMessage: (message: Message | null) => void;
  setIsVisibleForwardMessage: (isVisible: boolean) => void;
  setSelectedMessage: (messageId: Message | null) => void;
  setReplyMessage: (message: Message | null) => void;
  setIsVisibleReplyMessage: (isVisible: boolean) => void;
  setIsVisibleEditMessage: (isVisible: boolean) => void;
  setEditMessage: (message: Message | null) => void;
  getReplyMessage: () => TMessageState['replyMessage'];
  setOtherInputFocus: (value: boolean) => void;
};
