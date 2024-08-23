import { create } from 'zustand';

import { TImageSendModalState } from './modal.types';

export const useImageSendModalStore = create<TImageSendModalState>((set, get) => ({
  isModalOpen: false,
  file: { url: '', type: '' },
  recipient: '',
  dialogId: '',
  inputValue: '',
  error: '',
  setInputValue: (inputValue) => set({ inputValue }),
  addInputValue: (inputValue) => set({ inputValue: get().inputValue + inputValue }),
  openModal: () => {
    window.history.pushState('imageSend', '', '');
    set({ isModalOpen: true, dialogId: '', recipient: '' });
  },
  closeModal: () => set({ isModalOpen: false }),
  setFile: (file) => set({ file }),
  setRecipient: (recipient) => set({ recipient }),
  setDialogId: (dialogId) => set({ dialogId }),
  setError: (error) => set({ error }),
}));
