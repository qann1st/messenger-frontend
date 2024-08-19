import { FC } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { useMessageStore } from '~/entities';
import { DialogsList } from '~/features';
import { classNames, useEscCloseModal } from '~/shared';

import styles from './ForwardMessageModal.module.css';

import { useForwardMessageModalStore } from '../model';

const ForwardMessageModal: FC = () => {
  const { isModalOpen, closeModal, forwardMessage } = useForwardMessageModalStore();
  const [isVisibleEditMessage, isVisibleReplyMessage, setIsVisibleEditMessage, setIsVisibleReplyMessage] =
    useMessageStore(
      useShallow((state) => [
        state.isVisibleEditMessage,
        state.isVisibleReplyMessage,
        state.setIsVisibleEditMessage,
        state.setIsVisibleReplyMessage,
      ]),
    );

  const [setIsVisibleForwardMessage, setForwardMessage] = useMessageStore(
    useShallow((state) => [state.setIsVisibleForwardMessage, state.setForwardMessage]),
  );

  const navigate = useNavigate();

  useEscCloseModal(closeModal);

  if (!isModalOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.modal_overlay} onClick={closeModal}>
      <div className={classNames(styles.modal_content)} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_header}>
          <button onClick={closeModal} className={styles.modal_cclose}>
            <IoClose size={26} />
          </button>
          <p className={styles.modal_title}>Forward to</p>
        </div>
        <DialogsList
          hasIsActive={false}
          isForward
          onUserClick={(dialog) => {
            if (isVisibleReplyMessage) {
              setIsVisibleReplyMessage(false);
            }
            if (isVisibleEditMessage) {
              setIsVisibleEditMessage(false);
            }
            setForwardMessage(forwardMessage);
            setIsVisibleForwardMessage(true);
            navigate(`/${dialog.id}`);
            closeModal();
          }}
        />
      </div>
    </div>,
    document.getElementById('root-modal') as HTMLElement,
  );
};

export { ForwardMessageModal };
