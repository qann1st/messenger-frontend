import { create } from 'zustand';

import { TMessageState } from './message.types';

export const useMessageStore = create<TMessageState>((set, get) => ({
  replyMessage: null,
  forwardMessage: null,
  isVisibleReplyMessage: false,
  isVisibleEditMessage: false,
  isVisibleForwardMessage: false,
  selectedMessage: null,
  editMessage: null,
  otherInputFocus: false,
  setForwardMessage: (message) => set({ forwardMessage: message }),
  setIsVisibleForwardMessage: (isVisible) => set({ isVisibleForwardMessage: isVisible }),
  setReplyMessage: (message) => set({ replyMessage: message }),
  setSelectedMessage: (message) => set({ selectedMessage: message }),
  setIsVisibleReplyMessage: (isVisible) => set({ isVisibleReplyMessage: isVisible }),
  setIsVisibleEditMessage: (isVisible) => set({ isVisibleEditMessage: isVisible }),
  setEditMessage: (message) => set({ editMessage: message }),
  getReplyMessage: () => get().replyMessage,
  setOtherInputFocus: (value) => set({ otherInputFocus: value }),
}));
