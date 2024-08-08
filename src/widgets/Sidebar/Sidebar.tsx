import { FC, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

import { DialogsList, Resizer, SearchDialogsList, SearchInput, ThemeButton } from '~/features';
import { classNames, useMobileStore, useSearchStore } from '~/shared';

import styles from './Sidebar.module.css';

const Sidebar: FC = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isSearch } = useSearchStore();
  const { type } = useMobileStore();

  const { dialogId } = useParams();

  return (
    <aside
      className={classNames(
        styles.relative,
        type !== 'desktop' && styles.relative_mobile,
        type !== 'desktop' && dialogId && styles.slide,
      )}
    >
      <nav
        className={classNames(
          styles.root,
          type === 'mobile' && styles.mobile,
          dialogId && type !== 'desktop' && styles.root_slide,
        )}
        ref={sidebarRef}
      >
        <header className={styles.header}>
          <h1>
            <Link className={styles.link} to='/'>
              Chats
            </Link>
          </h1>
          <ThemeButton />
        </header>
        <SearchInput className={styles.input} />
        {isSearch ? <SearchDialogsList /> : <DialogsList />}
      </nav>
      <Resizer elementRef={sidebarRef} />
    </aside>
  );
};

export { Sidebar };
