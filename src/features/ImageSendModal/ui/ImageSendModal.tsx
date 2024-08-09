import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { useShallow } from 'zustand/react/shallow';

import { QueryClientProvider } from '@tanstack/react-query';

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

  const isImage = file?.type.includes('image');

  return createPortal(
    <div
      className={styles.modal_overlay}
      onClick={() => {
        if (type !== 'mobile') {
          onClose();
        }
      }}
    >
      <div
        className={classNames(styles.modal_content, isImage && styles.modal_content_image)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modal_header}>
          <button onClick={onClose} className={styles.modal_close}>
            <IoClose size={26} />
          </button>
          <p className={styles.modal_title}>Send 1 {isImage ? 'photo' : 'audio'}</p>
        </div>
        {isImage ? (
          <>
            {isLoading && <Skeleton.Rectangle width='100%' height={300} />}
            {error ? (
              <p className={styles.error}>{error}</p>
            ) : (
              <div className={styles.image_center}>
                <img
                  onLoad={() => setIsLoading(false)}
                  className={classNames(styles.image_preview, !isLoading && styles.image_visible)}
                  src={file.url}
                  alt=''
                />
              </div>
            )}
            <QueryClientProvider client={queryClient}>
              <MessageInput
                file={file.url}
                type='not-absolute'
                dialogId={dialogId}
                inputValue={inputValue}
                setInputValue={setInputValue}
                recipient={recipient}
                haveButtons={false}
                isDisabled={isLoading || error !== ''}
              />
            </QueryClientProvider>
          </>
        ) : (
          ''
        )}
      </div>
    </div>,
    document.getElementById('root-modal') as HTMLElement,
  );
};

export { ImageSendModal };
