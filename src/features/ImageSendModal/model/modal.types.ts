export type TImageSendModalState = {
  isModalOpen: boolean;
  file: string;
  recipient: string;
  dialogId: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  openModal: () => void;
  closeModal: () => void;
  setFile: (file: string) => void;
  setRecipient: (recipient: string) => void;
  setDialogId: (dialogId: string) => void;
};
