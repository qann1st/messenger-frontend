import { create } from 'zustand';

type TImageSendModalState = {
  inputValue: string;
  isDragging: boolean;
  setInputValue: (inputValue: string) => void;
  setIsDragging: (isDragging: boolean) => void;
};

export const useMessageInputStore = create<TImageSendModalState>((set) => ({
  inputValue: '',
  isDragging: false,
  setInputValue: (inputValue) => set({ inputValue }),
  setIsDragging: (isDragging) => set({ isDragging }),
}));
