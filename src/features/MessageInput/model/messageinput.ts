import { create } from 'zustand';

type TImageSendModalState = {
  inputValue: string;
  isDragging: boolean;
  setInputValue: (inputValue: string) => void;
  addInputValue: (inputValue: string) => void;
  setIsDragging: (isDragging: boolean) => void;
};

export const useMessageInputStore = create<TImageSendModalState>((set, get) => ({
  inputValue: '',
  isDragging: false,
  setInputValue: (inputValue) => set({ inputValue }),
  addInputValue: (inputValue) => {
    set({
      inputValue: get().inputValue + inputValue,
    });
  },
  setIsDragging: (isDragging) => set({ isDragging }),
}));
