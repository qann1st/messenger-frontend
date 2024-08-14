import { Message } from '~/shared';

export type TForwardMessageModalState = {
  isModalOpen: boolean;
  forwardMessage: Message | null;
  openModal: (forwardMessage: Message) => void;
  closeModal: () => void;
};
