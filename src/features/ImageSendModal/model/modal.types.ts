export type TImageSendModalState = {
  isModalOpen: boolean;
  file: { url: string; type: string };
  recipient: string;
  dialogId: string;
  inputValue: string;
  error: string;
  addInputValue: (value: string) => void;
  setInputValue: (value: string) => void;
  openModal: () => void;
  closeModal: () => void;
  setFile: (file: TImageSendModalState['file']) => void;
  setRecipient: (recipient: string) => void;
  setDialogId: (dialogId: string) => void;
  setError: (error: string) => void;
};
