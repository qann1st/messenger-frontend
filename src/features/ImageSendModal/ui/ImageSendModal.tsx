import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { useShallow } from 'zustand/react/shallow';

import { QueryClientProvider } from '@tanstack/react-query';

import { MessageInput, useMessageInputStore } from '~/features';
import {
  Skeleton,
  chunkArray,
  classNames,
  queryClient,
  useEscCloseModal,
  useMobileStore,
  usePopStateCloseModal,
} from '~/shared';

import styles from './ImageSendModal.module.css';

import { useImageSendModalStore } from '../model';

const ImageSendModal = () => {
  const [setMessageInputValue] = useMessageInputStore(useShallow((state) => [state.setInputValue]));
  const {
    isModalOpen,
    files,
    closeModal,
    recipient,
    setError,
    dialogId,
    inputValue,
    setInputValue,
    error,
    addInputValue,
  } = useImageSendModalStore();
  const { type } = useMobileStore();

  const [isLoading, setIsLoading] = useState(new Array(files.length).fill(true));

  const onClose = () => {
    setMessageInputValue(inputValue);
    setInputValue('');
    setError('');
    closeModal();
  };

  useEscCloseModal(onClose);
  usePopStateCloseModal(onClose);

  useEffect(() => {
    if (isModalOpen) {
      setIsLoading(new Array(files.length).fill(true));
    }
  }, [isModalOpen]);

  if (!isModalOpen) {
    return null;
  }

  const isAllLoading = isLoading.every((l) => l);

  return createPortal(
    <div
      className={styles.modal_overlay}
      onClick={() => {
        if (type !== 'mobile') {
          onClose();
        }
      }}
    >
      <div className={classNames(styles.modal_content)} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_header}>
          <button onClick={onClose} className={styles.modal_close}>
            <IoClose size={26} />
          </button>
          <p className={styles.modal_title}>Send {files.length} photo</p>
        </div>
        {isAllLoading && (
          <Skeleton.Rectangle borderRadius='var(--border-radius-8)' width='100%' height='40vh' />
        )}
        <div className={classNames(styles.images_container, !isAllLoading && styles.images_container_visible)}>
          {chunkArray<{ url: string; type: string }>(files, 2).map((filesArr, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className={styles.images_row} key={i}>
              {filesArr.map((file, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={`${file.url}-${index}`}>
                  {error ? (
                    <p className={styles.error}>{error}</p>
                  ) : (
                    <img
                      onLoad={() => setIsLoading((l) => [...l.slice(0, index), false])}
                      className={classNames(
                        styles.image_preview,
                        index === 0 ? styles.image_left : styles.image_right,
                        styles.image_visible,
                      )}
                      src={file.url}
                      alt=''
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <QueryClientProvider client={queryClient}>
          <MessageInput
            addInputValue={addInputValue}
            files={files}
            type='not-absolute'
            dialogId={dialogId}
            inputValue={inputValue}
            setInputValue={setInputValue}
            recipient={recipient}
            haveButtons={false}
            isDisabled={isAllLoading || error !== ''}
          />
        </QueryClientProvider>
      </div>
    </div>,
    document.getElementById('root-modal') as HTMLElement,
  );
};

export { ImageSendModal };
