import { create } from 'zustand';

import { Message } from '~/shared';

import { TForwardMessageModalState } from './modal.types';

export const useForwardMessageModalStore = create<TForwardMessageModalState>((set) => ({
  imageLink: '',
  isModalOpen: false,
  forwardMessage: null,
  openModal: (forwardMessage: Message) => set({ isModalOpen: true, forwardMessage }),
  closeModal: () => set({ isModalOpen: false, forwardMessage: null }),
}));
