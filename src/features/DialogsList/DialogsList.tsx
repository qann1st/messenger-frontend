import { FC, type MouseEvent, useMemo, useRef, useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { IoOpenOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

import { UserBadge } from '~/entities';
import {
  ContextMenu,
  Chat as TChat,
  User,
  getRecipientFromUsers,
  useContextMenu,
  useHandleOnlineSocket,
  useMobileStore,
  useUserStore,
} from '~/shared';

import styles from './DialogsList.module.css';

type TProps = { hasIsActive?: boolean; isForward?: boolean; onUserClick?: (dialog: TChat) => void };
const DialogsList: FC<TProps> = ({ onUserClick, hasIsActive = true, isForward = false }) => {
  const scrollRef = useRef<HTMLUListElement>(null);
  const { socket, user, setUser } = useUserStore();
  const { contextMenu, contextMenuRef, showContextMenu, hideContextMenu } = useContextMenu<HTMLUListElement>(scrollRef);

  const [selectedDialog, setSelectedDialog] = useState<TChat | null>(null);

  useHandleOnlineSocket();

  const handleContextMenu = (e: MouseEvent<HTMLAnchorElement>, dialog: TChat) => {
    showContextMenu(e);
    setSelectedDialog(dialog);
  };

  const handleDeleteClick = async () => {
    hideContextMenu();
    if (!socket || !selectedDialog) {
      return;
    }

    socket.emit('delete-chat', {
      roomId: selectedDialog.id,
      recipient: getRecipientFromUsers(selectedDialog.users, user?.id ?? '')?.id,
    });
    setUser({ ...user, dialogs: user?.dialogs.filter((el) => el.id !== selectedDialog.id) } as User);
  };

  const buttons = [
    {
      icon: IoOpenOutline,
      text: 'Open in new tab',
      onClick: () => {
        hideContextMenu();
        window.open(`/${selectedDialog?.id}`);
      },
    },
    {
      icon: BsTrash,
      text: 'Delete',
      isDelete: true,
      onClick: handleDeleteClick,
    },
  ];

  return (
    <ul className={styles.dialogs} ref={scrollRef}>
      {user?.dialogs.length ? (
        user?.dialogs.map((dialog) => (
          <Gg
            key={dialog.id}
            hasIsActive={hasIsActive}
            onUserClick={onUserClick}
            isForward={isForward}
            dialog={dialog}
            onContextMenu={handleContextMenu}
          />
        ))
      ) : (
        <p className={styles.text}>No dialogs</p>
      )}
      <ContextMenu
        isToggled={contextMenu.toggled}
        posX={contextMenu.position.x}
        posY={contextMenu.position.y}
        ref={contextMenuRef}
        buttons={buttons}
      />
    </ul>
  );
};

const Gg: FC<TProps & { dialog: TChat; onContextMenu: (e: MouseEvent<HTMLAnchorElement>, dialog: TChat) => void }> = ({
  onUserClick,
  hasIsActive = true,
  isForward = false,
  dialog,
  onContextMenu,
}) => {
  const { type, lastChat } = useMobileStore();
  const { user } = useUserStore();

  const dialogId = useParams().dialogId ?? (type !== 'desktop' ? lastChat : '');

  const recipient = useMemo(() => getRecipientFromUsers(dialog.users ?? [], user?.id ?? ''), []);
  const messages = dialog?.messages?.[0] ?? [];
  return (
    <UserBadge
      key={dialog.id}
      dialog={dialog}
      isForward={isForward}
      hasForwardedMessage={!!messages.forwardedMessage?.chatId}
      href={`/${dialog.id}`}
      printing={dialog.printing}
      isOnline={recipient?.isOnline}
      lastName={recipient?.lastname}
      firstName={recipient?.firstname}
      onClick={() => onUserClick?.(dialog)}
      isActive={hasIsActive && dialog.id === dialogId}
      lastMessageImage={messages?.images?.length > 0 ? messages.images : messages.forwardedMessage?.images}
      lastMessage={messages?.content || messages.forwardedMessage?.content}
      lastMessageVoice={messages.voiceMessage || messages.forwardedMessage?.voiceMessage}
      unreadedMessages={dialog.unreadedMessages}
      showContextMenu={(e) => onContextMenu(e, dialog)}
    />
  );
};

export { DialogsList };
