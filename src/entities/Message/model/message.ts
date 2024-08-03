import { create } from 'zustand';

import { TMessageState } from './message.types';

export const useMessageStore = create<TMessageState>((set, get) => ({
  replyMessage: null,
  isVisibleReplyMessage: false,
  isVisibleEditMessage: false,
  selectedMessage: null,
  editMessage: null,
  inputValue: '',
  setReplyMessage: (message) => set({ replyMessage: message }),
  setSelectedMessage: (message) => set({ selectedMessage: message }),
  setIsVisibleReplyMessage: (isVisible) => set({ isVisibleReplyMessage: isVisible }),
  setIsVisibleEditMessage: (isVisible) => set({ isVisibleEditMessage: isVisible }),
  setInputValue: (value) => set({ inputValue: value }),
  setEditMessage: (message) => set({ editMessage: message }),
  getReplyMessage: () => get().replyMessage,
}));
