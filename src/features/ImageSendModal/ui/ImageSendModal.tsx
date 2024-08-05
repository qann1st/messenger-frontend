import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';

import { QueryClientProvider } from '@tanstack/react-query';

import { MessageInput } from '~/features/MessageInput';
import { queryClient } from '~/shared';

import styles from './ImageSendModal.module.css';

import { useImageSendModalStore } from '../model';

const ImageSendModal = () => {
  const { isModalOpen, file, closeModal, recipient, dialogId, inputValue, setInputValue } = useImageSendModalStore();

  if (!isModalOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.modal_overlay} onClick={closeModal}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_header}>
          <button onClick={closeModal} className={styles.modal_close}>
            <IoClose size={26} />
          </button>
          <p className={styles.modal_title}>Send 1 photo</p>
        </div>
        <div className={styles.image_center}>
          <img className={styles.image_preview} src={file} alt='' draggable='true' />
        </div>
        <QueryClientProvider client={queryClient}>
          <MessageInput
            file={file}
            type='not-absolute'
            dialogId={dialogId}
            inputValue={inputValue}
            setInputValue={setInputValue}
            recipient={recipient}
          />
        </QueryClientProvider>
      </div>
    </div>,
    document.getElementById('root-modal') as HTMLElement,
  );
};

export { ImageSendModal };
