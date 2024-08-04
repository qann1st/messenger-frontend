import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

import { DialogsList, Resizer, SearchDialogsList, SearchInput, ThemeButton } from '~/features';
import { classNames, useMobileStore, useSearchStore } from '~/shared';

import styles from './Sidebar.module.css';

const Sidebar = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isSearch } = useSearchStore();
  const { type } = useMobileStore();

  const { dialogId } = useParams();

  return (
    <div
      className={classNames(
        styles.relative,
        type !== 'desktop' && styles.relative_mobile,
        type === 'tablet' && dialogId && styles.slide,
      )}
    >
      <div
        className={classNames(styles.root, type === 'mobile' && styles.mobile, dialogId && styles.root_slide)}
        ref={sidebarRef}
      >
        <div className={styles.header}>
          <h1>
            <Link className={styles.link} to='/'>
              Chats
            </Link>
          </h1>
          <ThemeButton />
        </div>
        <SearchInput className={styles.input} />
        {isSearch ? <SearchDialogsList /> : <DialogsList />}
      </div>
      <Resizer elementRef={sidebarRef} />
    </div>
  );
};

export { Sidebar };
