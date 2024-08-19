import { FC } from 'react';

import { classNames } from '~/shared';

import styles from './Switcher.module.css';

import { TSwitcherProps } from './Switcher.types';

const Switcher: FC<TSwitcherProps> = ({ isActive, setIsActive }) => (
  <div onClick={() => setIsActive?.(!isActive)} className={classNames(styles.root, isActive && styles.active)}>
    <div className={styles.circle}></div>
  </div>
);

export { Switcher };
