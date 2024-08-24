export type TImageSendModalState = {
  isModalOpen: boolean;
  files: { url: string; type: string }[];
  recipient: string;
  dialogId: string;
  inputValue: string;
  error: string;
  addInputValue: (value: string) => void;
  setInputValue: (value: string) => void;
  openModal: () => void;
  closeModal: () => void;
  setFiles: (file: TImageSendModalState['files']) => void;
  setRecipient: (recipient: string) => void;
  setDialogId: (dialogId: string) => void;
  setError: (error: string) => void;
};
