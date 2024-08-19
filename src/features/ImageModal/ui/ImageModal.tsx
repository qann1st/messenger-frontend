import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';

import { useEscCloseModal } from '~/shared';

import styles from './ImageModal.module.css';

import { useImageModalStore } from '../model';

const ImageModal = () => {
  const { isModalOpen, closeModal, imageLink } = useImageModalStore();

  useEscCloseModal(closeModal);

  if (!isModalOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.modal_overlay} onClick={closeModal}>
      <button onClick={closeModal} className={styles.modal_close}>
        <IoClose size={32} />
      </button>
      <img className={styles.image_preview} src={imageLink} alt='' />
    </div>,
    document.getElementById('root-modal') as HTMLElement,
  );
};

export { ImageModal };
