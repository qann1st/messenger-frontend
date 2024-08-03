import { FC, memo } from 'react';

import { classNames } from '~/shared';

import styles from './Avatar.module.css';

import { TAvatarProps } from './Avatar.types';

const Avatar: FC<TAvatarProps> = memo(
  ({ firstName, className, isOnline, isActive, lastName = '', size = 'medium' }) => {
    const name = firstName?.slice(0, 1).toUpperCase() + lastName?.slice(0, 1).toUpperCase();

    return (
      <div className={classNames(styles.root, styles[size], className)}>
        <p>{name}</p>
        <div className={classNames(styles.offline, isOnline && styles.online, isActive && styles.active)} />
      </div>
    );
  },
);

export { Avatar };
