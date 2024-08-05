import { useState } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';

import { QueryClientProvider } from '@tanstack/react-query';

import { MessageInput } from '~/features';
import { queryClient } from '~/shared';

import styles from './ImageSendModal.module.css';

import { useImageSendModalStore } from '../model';

const ImageSendModal = () => {
  const { isModalOpen, file, closeModal, recipient, dialogId, inputValue, setInputValue, error } =
    useImageSendModalStore();
  const [isLoading, setIsLoading] = useState(true);

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
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <div className={styles.image_center}>
            <img
              onLoad={() => setIsLoading(false)}
              className={styles.image_preview}
              src={file}
              alt=''
              draggable='true'
            />
          </div>
        )}
        <QueryClientProvider client={queryClient}>
          <MessageInput
            file={file}
            type='not-absolute'
            dialogId={dialogId}
            inputValue={inputValue}
            setInputValue={setInputValue}
            recipient={recipient}
            haveButtons={false}
            isDisabled={isLoading || error !== ''}
          />
        </QueryClientProvider>
      </div>
    </div>,
    document.getElementById('root-modal') as HTMLElement,
  );
};

export { ImageSendModal };
