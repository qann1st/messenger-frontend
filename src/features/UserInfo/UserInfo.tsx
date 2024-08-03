import { FC } from 'react';

import { Avatar, classNames, formatOnlineDate } from '~/shared';

import styles from './UserInfo.module.css';

import { TUserInfoProps } from './UserInfo.types';

const UserInfo: FC<TUserInfoProps> = ({ recipient, hasAvatar = true }) => (
  <div className={styles.user_info}>
    {hasAvatar && <Avatar size='medium' firstName={recipient?.firstname} lastName={recipient?.lastname} />}
    <div>
      <p className={styles.user_title}>
        {recipient?.firstname} {recipient?.lastname}
      </p>
      <p className={classNames(styles.text, recipient.isOnline && styles.online)}>
        {recipient.isOnline ? 'online' : `was ${formatOnlineDate(recipient.lastOnline ?? 0)}`}
      </p>
    </div>
  </div>
);

export { UserInfo };
