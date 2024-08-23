import { FC, useRef, useState } from 'react';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import { LuSettings } from 'react-icons/lu';
import { MdDarkMode, MdMenu, MdOutlineHelpOutline } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { DialogsList, Dropdown, Resizer, SearchDialogsList, SearchInput } from '~/features';
import { Settings } from '~/features/Settings';
import {
  TSettings,
  classNames,
  toggleDarkMode,
  useLocalStorage,
  useMobileStore,
  useOutsideClick,
  useSearchStore,
  useThemeStore,
} from '~/shared';

import styles from './Sidebar.module.css';

const Sidebar: FC = () => {
  const [isToggledDropdownMenu, setIsToggledDropdownMenu] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  const [settings, setSettings] = useLocalStorage<TSettings>('settings', { isSoundNotifications: true });
  const [isSettingsOpened, setIsSettingsOpened] = useState(false);

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
          isSettingsOpened && styles.root_translated,
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
                icon: LuSettings,
                onClick: () => {
                  setIsSettingsOpened(true);
                  setIsToggledDropdownMenu(false);
                  window.history.pushState('settings', '', '');
                },
                text: 'Settings',
              },
              {
                icon: MdOutlineHelpOutline,
                onClick: () => {
                  window.open('https://t.me/qann1st');
                  setIsToggledDropdownMenu(false);
                },
                text: 'Report a bug',
              },
            ]}
            isToggled={isToggledDropdownMenu}
            className={styles.dropdown_menu}
          />
          <SearchInput className={styles.input} />
        </div>
        {isSearch ? <SearchDialogsList /> : <DialogsList hasIsActive={type !== 'mobile'} />}
      </nav>
      <Settings isOpened={isSettingsOpened} onClose={() => setIsSettingsOpened(false)} />
      <Resizer elementRef={sidebarRef} />
    </aside>
  );
};

export { Sidebar };
