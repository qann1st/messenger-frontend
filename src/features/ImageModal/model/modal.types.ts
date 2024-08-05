export type TImageModalState = {
  imageLink: string;
  isModalOpen: boolean;
  setImageLink: (value: string) => void;
  openModal: () => void;
  closeModal: () => void;
};
