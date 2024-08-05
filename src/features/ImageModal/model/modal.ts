import { create } from 'zustand';

import { TImageModalState } from './modal.types';

export const useImageModalStore = create<TImageModalState>((set) => ({
  imageLink: '',
  isModalOpen: false,
  setImageLink: (value) => set({ imageLink: value }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false, imageLink: '' }),
}));
