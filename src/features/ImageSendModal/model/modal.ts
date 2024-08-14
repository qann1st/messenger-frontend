import { create } from 'zustand';

import { TImageSendModalState } from './modal.types';

export const useImageSendModalStore = create<TImageSendModalState>((set) => ({
  isModalOpen: false,
  file: { url: '', type: '' },
  recipient: '',
  dialogId: '',
  inputValue: '',
  error: '',
  setInputValue: (inputValue) => set({ inputValue }),
  openModal: () => set({ isModalOpen: true, dialogId: '', recipient: '' }),
  closeModal: () => set({ isModalOpen: false }),
  setFile: (file) => set({ file }),
  setRecipient: (recipient) => set({ recipient }),
  setDialogId: (dialogId) => set({ dialogId }),
  setError: (error) => set({ error }),
}));
