import { useRef } from 'react';
import { Link } from 'react-router-dom';

import { DialogsList, Resizer, SearchDialogsList, SearchInput, ThemeButton } from '~/features';
import { useSearchStore } from '~/shared';

import styles from './Sidebar.module.css';

const Sidebar = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isSearch } = useSearchStore();

  return (
    <div className={styles.relative}>
      <div className={styles.root} ref={sidebarRef}>
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
