import { FC } from 'react';
import { IoArrowBack } from 'react-icons/io5';

import { classNames } from '~/shared/lib';

import styles from './SidebarLayout.module.css';

import { TSidebarLayoutProps } from './SidebarLayout.types';

const SidebarLayout: FC<TSidebarLayoutProps> = ({
  onClose,
  isSlide,
  setIsVisible,
  right,
  children,
  isOpened,
  title,
}) => (
  <div className={classNames(styles.root, isOpened && styles.root_visible, isSlide && styles.root_slide)}>
    <div className={styles.top}>
      <div className={styles.top_left}>
        <button
          onClick={() => {
            onClose();
            setIsVisible(false);
          }}
          className={styles.icon_button}
        >
          <IoArrowBack size={24} />
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>
      {right && <div className={styles.top_right}>{right}</div>}
    </div>
    <div className={styles.content}>{children}</div>
  </div>
);

export { SidebarLayout };
