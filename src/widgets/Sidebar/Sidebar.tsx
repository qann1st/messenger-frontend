import { FC, useRef, useState } from 'react';
import { MdDarkMode, MdLightMode, MdMenu } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { DialogsList, Resizer, SearchDialogsList, SearchInput } from '~/features';
import { Dropdown } from '~/features/Dropdown/Dropdown';
import { classNames, useMobileStore, useOutsideClick, useSearchStore, useThemeStore } from '~/shared';
import { toggleDarkMode } from '~/shared/lib/helpers/toggleDarkMode';

import styles from './Sidebar.module.css';

const Sidebar: FC = () => {
  const [isToggledDropdownMenu, setIsToggledDropdownMenu] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  useOutsideClick(dropdownRef, () => setIsToggledDropdownMenu(false), isToggledDropdownMenu, dropdownButtonRef);

  const isSearch = useSearchStore((state) => state.isSearch);
  const { type } = useMobileStore();
  const { theme, toggleTheme } = useThemeStore();

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
        <div className={styles.nav}>
          <button
            ref={dropdownButtonRef}
            onClick={() => setIsToggledDropdownMenu((prev) => !prev)}
            className={styles.dropdown}
          >
            <MdMenu size={24} />
          </button>
          <Dropdown
            ref={dropdownRef}
            setIsVisible={setIsToggledDropdownMenu}
            buttons={[
              {
                icon: theme === 'dark' ? MdLightMode : MdDarkMode,
                text: theme === 'dark' ? 'Light mode' : 'Dark mode',
                onClick: (ref) => {
                  toggleDarkMode(theme, toggleTheme, ref);
                },
              },
            ]}
            isToggled={isToggledDropdownMenu}
            className={styles.dropdown_menu}
          />
          <SearchInput className={styles.input} />
        </div>

        {isSearch ? <SearchDialogsList /> : <DialogsList />}
      </nav>
      <Resizer elementRef={sidebarRef} />
    </aside>
  );
};

export { Sidebar };
