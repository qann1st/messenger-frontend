import { FC, memo } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';

import { Avatar, Skeleton, classNames, formatOnlineDate, useMobileStore } from '~/shared';

import styles from './UserInfo.module.css';

import { TUserInfoProps } from './UserInfo.types';

const UserInfo: FC<TUserInfoProps> = memo(({ recipient, hasAvatar = true }) => {
  const { type, lastChat } = useMobileStore();
  const params = useParams();
  const dialogId = params.dialogId ?? (type !== 'desktop' ? lastChat : '');

  const navigate = useNavigate();

  return (
    <div className={styles.user_info}>
      {type !== 'desktop' && (
        <button
          onClick={() => {
            if (params.dialogId) {
              navigate(-1);
            } else {
              navigate(dialogId);
            }
          }}
          className={styles.back}
        >
          <IoArrowBack size={32} />
        </button>
      )}
      {hasAvatar && !recipient ? (
        <Skeleton.Circle />
      ) : (
        <Avatar size='medium' firstName={recipient?.firstname} lastName={recipient?.lastname} />
      )}
      <div>
        {!recipient ? (
          <Skeleton.Rectangle height={12} width={150} className={styles.rect} />
        ) : (
          <p className={styles.user_title}>
            {recipient?.firstname} {recipient?.lastname}
          </p>
        )}
        {!recipient ? (
          <Skeleton.Rectangle height={12} width={60} />
        ) : (
          <p className={classNames(styles.text, recipient.isOnline && styles.online)}>
            {recipient.isOnline ? 'online' : `was ${formatOnlineDate(Number(recipient.lastOnline))}`}
          </p>
        )}
      </div>
    </div>
  );
});

export { UserInfo };
