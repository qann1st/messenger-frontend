import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { useShallow } from 'zustand/react/shallow';

import { QueryClientProvider } from '@tanstack/react-query';

import { useMessageStore } from '~/entities';
import { MessageInput, useMessageInputStore } from '~/features';
import { Skeleton, classNames, queryClient, useMobileStore } from '~/shared';

import styles from './ImageSendModal.module.css';

import { useImageSendModalStore } from '../model';

const ImageSendModal = () => {
  const [setMessageInputValue] = useMessageInputStore(useShallow((state) => [state.setInputValue]));
  const { isModalOpen, file, closeModal, recipient, dialogId, inputValue, setInputValue, error } =
    useImageSendModalStore();
  const { type } = useMobileStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isModalOpen) {
      setIsLoading(true);
    }
  }, [isModalOpen]);

  if (!isModalOpen) {
    return null;
  }

  const onClose = () => {
    setMessageInputValue(inputValue);
    setInputValue('');
    closeModal();
  };

  return createPortal(
    <div
      className={styles.modal_overlay}
      onClick={() => {
        if (type !== 'mobile') {
          onClose();
        }
      }}
    >
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_header}>
          <button onClick={onClose} className={styles.modal_close}>
            <IoClose size={26} />
          </button>
          <p className={styles.modal_title}>Send 1 photo</p>
        </div>
        {isLoading && <Skeleton.Rectangle width='100%' height={300} />}
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <div className={styles.image_center}>
            <img
              onLoad={() => setIsLoading(false)}
              className={classNames(styles.image_preview, !isLoading && styles.image_visible)}
              src={file}
              alt=''
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
