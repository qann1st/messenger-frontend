import { type FC, memo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Avatar,
  User,
  classNames,
  highlightMessage,
  messengerApi,
  rippleAnimation,
  useSearchStore,
  useUserStore,
} from '~/shared';

import styles from './UserBadge.module.css';

import { TUserBadgeProps } from './UserBadge.types';

const UserBadge: FC<TUserBadgeProps> = memo(
  ({
    firstName,
    isSearch,
    lastName,
    isOnline,
    lastMessage,
    lastMessageImage,
    lastMessageVoice,
    isActive,
    href,
    userId,
    showContextMenu,
  }) => {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const animationRef = useRef<HTMLButtonElement>(null);

    const { user, setUser } = useUserStore();
    const { clearDialogs, setIsSearch, setInputValue } = useSearchStore();

    const navigate = useNavigate();

    const handleButtonClick = async () => {
      clearDialogs();
      setIsSearch(false);
      setInputValue('');

      if (!user) {
        return;
      }
      const chat = user.dialogs.find((dialog) => dialog.users.some((el) => el.id === userId));

      if (chat) {
        return navigate(`/${chat.id}`);
      }
      if (user && userId) {
        const newChat = await messengerApi.createChat(userId);
        setUser({ ...user, dialogs: [newChat, ...user.dialogs] } as User);
        navigate(`/${newChat.id}`);
      }
    };

    if (isSearch) {
      return (
        <button ref={animationRef} draggable='false' className={classNames(styles.root)} onClick={handleButtonClick}>
          <Avatar
            className={styles.avatar}
            isActive={isActive}
            isOnline={isOnline}
            size='large'
            firstName={firstName}
            lastName={lastName}
          />
          <div className={styles.info}>
            <p className={classNames(styles.name, isActive && styles.name_active)}>
              {firstName} {lastName}
            </p>
            <p className={classNames(styles.subtitle, isActive && styles.subtitle_active)}>{lastMessage}</p>
          </div>
        </button>
      );
    }

    return (
      <>
        <Link
          to={href ?? ''}
          ref={linkRef}
          role='button'
          draggable='false'
          className={classNames(styles.root, isActive && styles.active)}
          onContextMenu={showContextMenu}
          onClick={(e) => rippleAnimation({ e, ref: linkRef, className: styles.ripple, size: 125, duration: 800 })}
        >
          <Avatar
            className={styles.avatar}
            isActive={isActive}
            isOnline={isOnline}
            size='large'
            firstName={firstName}
            lastName={lastName}
          />
          <div className={styles.info}>
            <p className={classNames(styles.name, isActive && styles.name_active)}>
              {firstName} {lastName}
            </p>
            <div className={styles.info_subtitle}>
              {lastMessageImage?.length !== 0 && (
                <img draggable={false} src={lastMessageImage?.[0]} alt='' className={styles.image} />
              )}
              {lastMessage && (
                <p
                  className={classNames(styles.subtitle, isActive && styles.subtitle_active)}
                  dangerouslySetInnerHTML={{
                    __html: highlightMessage(lastMessage?.split('\\n').join(' ') ?? '', styles, false),
                  }}
                />
              )}
              <p className={classNames(styles.subtitle, isActive && styles.subtitle_active)}>
                {lastMessageImage && !lastMessage && 'Photo'}
                {lastMessageVoice && '🎤 Voice message'}
              </p>
            </div>
          </div>
        </Link>
      </>
    );
  },
);

export { UserBadge };
