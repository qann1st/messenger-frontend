import { create } from 'zustand';

import { TImageSendModalState } from './modal.types';

export const useImageSendModalStore = create<TImageSendModalState>((set) => ({
  isModalOpen: false,
  file: '',
  recipient: '',
  dialogId: '',
  inputValue: '',
  setInputValue: (inputValue) => set({ inputValue }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setFile: (file) => set({ file }),
  setRecipient: (recipient) => set({ recipient }),
  setDialogId: (dialogId) => set({ dialogId }),
}));
