import { type FC, memo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

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
    printing,
  }) => {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const animationRef = useRef<HTMLButtonElement>(null);

    const { user, setUser } = useUserStore();
    const [clearDialogs, setIsSearch, setInputValue] = useSearchStore(
      useShallow((state) => [state.clearDialogs, state.setIsSearch, state.setInputValue]),
    );

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
        <ul className={classNames(styles.root)}>
          <button ref={animationRef} draggable='false' onClick={handleButtonClick}>
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
        </ul>
      );
    }

    return (
      <li className={classNames(styles.root, isActive && styles.active)}>
        <Link
          to={href ?? ''}
          ref={linkRef}
          role='button'
          draggable='false'
          onContextMenu={showContextMenu}
          className={styles.link}
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
              {lastMessageImage?.length !== 0 &&
                lastMessageImage?.[0] !== 'null' &&
                lastMessageImage !== null &&
                lastMessageImage !== undefined &&
                !printing && <img draggable={false} src={lastMessageImage?.[0]} alt='' className={styles.image} />}
              {lastMessage && !printing && (
                <p
                  className={classNames(styles.subtitle, isActive && styles.subtitle_active)}
                  dangerouslySetInnerHTML={{
                    __html: highlightMessage(lastMessage?.split('\\n').join(' ') ?? '', styles, false),
                  }}
                />
              )}
              {printing && <p className={classNames(styles.printing, styles.subtitle)}>prints...</p>}
              {!printing && (
                <p className={classNames(styles.subtitle, isActive && styles.subtitle_active)}>
                  {lastMessageImage && !lastMessage && 'Photo'}
                  {lastMessageVoice && '🎤 Voice message'}
                </p>
              )}
            </div>
          </div>
        </Link>
      </li>
    );
  },
);

export { UserBadge };
