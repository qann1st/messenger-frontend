import { type MouseEvent, useState } from 'react';
import { BsTrash } from 'react-icons/bs';
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

const DialogsList = () => {
  const { type, lastChat } = useMobileStore();

  const dialogId = useParams().dialogId ?? (type !== 'desktop' ? lastChat : '');

  const { socket, user, setUser } = useUserStore();
  const { contextMenu, contextMenuRef, showContextMenu, hideContextMenu } = useContextMenu<HTMLAnchorElement>();

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
      roomId: dialogId,
      recipient: getRecipientFromUsers(selectedDialog.users, user?.id ?? '')?.id,
    });
    setUser({ ...user, dialogs: user?.dialogs.filter((el) => el.id !== dialogId) } as User);
  };

  const buttons = [
    {
      icon: BsTrash,
      text: 'Delete',
      isDelete: true,
      onClick: handleDeleteClick,
    },
  ];

  return (
    <div className={styles.dialogs}>
      {user?.dialogs.length ? (
        user.dialogs.map((dialog) => {
          const recipient = getRecipientFromUsers(dialog.users ?? [], user.id ?? '');
          const messages = dialog?.messages[0] ?? [];

          return (
            <UserBadge
              key={dialog.id}
              href={`/${dialog.id}`}
              isActive={dialog.id === dialogId}
              isOnline={recipient?.isOnline}
              firstName={recipient?.firstname}
              lastName={recipient?.lastname}
              lastMessage={messages?.content ?? ''}
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
    </div>
  );
};

export { DialogsList };
