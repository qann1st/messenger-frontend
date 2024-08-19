import { FC, useRef, useState } from 'react';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import { LuLogOut } from 'react-icons/lu';
import { MdDarkMode, MdMenu } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { DialogsList, Resizer, SearchDialogsList, SearchInput } from '~/features';
import { Dropdown } from '~/features';
import {
  classNames,
  messengerApi,
  useMobileStore,
  useOutsideClick,
  useSearchStore,
  useThemeStore,
  useUserStore,
} from '~/shared';
import { toggleDarkMode } from '~/shared';
import { useLocalStorage } from '~/shared';
import { TSettings } from '~/shared';

import styles from './Sidebar.module.css';

const Sidebar: FC = () => {
  const [isToggledDropdownMenu, setIsToggledDropdownMenu] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  const [settings, setSettings] = useLocalStorage<TSettings>('settings', { isSoundNotifications: true });

  useOutsideClick(dropdownRef, () => setIsToggledDropdownMenu(false), isToggledDropdownMenu, dropdownButtonRef);

  const isSearch = useSearchStore((state) => state.isSearch);
  const [setSocket, setUser] = useUserStore(useShallow((state) => [state.setSocket, state.setUser]));
  const { type } = useMobileStore();
  const { theme, toggleTheme } = useThemeStore();

  const navigate = useNavigate();
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
                icon: MdDarkMode,
                text: 'Dark mode',
                onClick: (ref) => {
                  toggleDarkMode(theme, toggleTheme, ref);
                },
                checkbox: true,
                isActive: theme === 'dark',
              },
              {
                icon: HiOutlineSpeakerWave,
                text: 'Sound notifications',
                onClick: () => {
                  setSettings((prev) => ({ ...prev, isSoundNotifications: !prev.isSoundNotifications }));
                },
                checkbox: true,
                isActive: settings.isSoundNotifications,
              },
              {
                icon: LuLogOut,
                text: 'Log out',
                isDelete: true,
                onClick: async () => {
                  await messengerApi.logout();
                  setSocket(null);
                  setUser(null);
                  navigate('/');
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
