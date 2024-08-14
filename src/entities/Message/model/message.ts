import { create } from 'zustand';

import { TMessageState } from './message.types';

export const useMessageStore = create<TMessageState>((set, get) => ({
  replyMessage: null,
  isVisibleReplyMessage: false,
  isVisibleEditMessage: false,
  selectedMessage: null,
  editMessage: null,
  otherInputFocus: false,
  scrollRef: { current: undefined },
  setScrollRef: (ref) => set({ scrollRef: { current: ref } }),
  setReplyMessage: (message) => set({ replyMessage: message }),
  setSelectedMessage: (message) => set({ selectedMessage: message }),
  setIsVisibleReplyMessage: (isVisible) => set({ isVisibleReplyMessage: isVisible }),
  setIsVisibleEditMessage: (isVisible) => set({ isVisibleEditMessage: isVisible }),
  setEditMessage: (message) => set({ editMessage: message }),
  getReplyMessage: () => get().replyMessage,
  setOtherInputFocus: (value) => set({ otherInputFocus: value }),
}));
