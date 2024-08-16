import { FC, type MouseEvent, useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { IoOpenOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

import { UserBadge } from '~/entities';
import {
  Chat,
  ContextMenu,
  User,
  getRecipientFromUsers,
  useContextMenu,
  useHandleOnlineSocket,
  useMobileStore,
  useUserStore,
} from '~/shared';

import styles from './DialogsList.module.css';

const DialogsList: FC<{ hasIsActive?: boolean; isForward?: boolean; onUserClick?: (dialog: Chat) => void }> = ({
  onUserClick,
  hasIsActive = true,
  isForward = false,
}) => {
  const { type, lastChat } = useMobileStore();

  const dialogId = useParams().dialogId ?? (type !== 'desktop' ? lastChat : '');

  const { socket, user, setUser } = useUserStore();
  const { contextMenu, contextMenuRef, showContextMenu, hideContextMenu } = useContextMenu();

  const [selectedDialog, setSelectedDialog] = useState<Chat | null>(null);

  useHandleOnlineSocket();

  const handleContextMenu = (e: MouseEvent<HTMLAnchorElement>, dialog: Chat) => {
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
      icon: BsTrash,
      text: 'Delete',
      isDelete: true,
      onClick: handleDeleteClick,
    },
    {
      icon: IoOpenOutline,
      text: 'Open in new tab',
      onClick: () => {
        hideContextMenu();
        window.open(`/${selectedDialog?.id}`);
      },
    },
  ];

  return (
    <ul className={styles.dialogs}>
      {user?.dialogs.length ? (
        user.dialogs.map((dialog) => {
          const recipient = getRecipientFromUsers(dialog.users ?? [], user.id ?? '');
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
              lastMessage={messages?.content ?? messages.forwardedMessage?.content}
              lastMessageVoice={messages.voiceMessage || messages.forwardedMessage?.voiceMessage}
              unreadedMessages={dialog.unreadedMessages}
              showContextMenu={(e) => handleContextMenu(e, dialog)}
            />
          );
        })
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

export { DialogsList };
