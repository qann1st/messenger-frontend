import { FC, useRef, useState } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';
import { LuLogOut, LuMoreVertical } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { Avatar, messengerApi, useOutsideClick, useUserStore } from '~/shared';
import { SidebarLayout } from '~/shared/ui/SidebarLayout';

import styles from './Settings.module.css';

import { Dropdown } from '../Dropdown';
import { EditProfile } from '../EditProfile';
import { TSettingsProps } from './Settings.types';

const Settings: FC<TSettingsProps> = ({ isOpened, onClose }) => {
  const [isToggledDropdownMenu, setIsToggledDropdownMenu] = useState(false);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);

  const [setSocket, setUser, user] = useUserStore(useShallow((state) => [state.setSocket, state.setUser, state.user]));

  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  useOutsideClick(dropdownRef, () => setIsToggledDropdownMenu(false), isToggledDropdownMenu, dropdownButtonRef);

  return (
    <>
      <SidebarLayout
        isSlide={isEditProfileVisible}
        isOpened={isOpened}
        onClose={onClose}
        setIsVisible={setIsToggledDropdownMenu}
        title='Settings'
        right={
          <>
            <button onClick={() => setIsEditProfileVisible(true)} className={styles.icon_button}>
              <HiOutlinePencil size={24} />
            </button>
            <button
              ref={dropdownButtonRef}
              onClick={() => setIsToggledDropdownMenu((prev) => !prev)}
              className={styles.icon_button}
            >
              <LuMoreVertical size={24} />
            </button>
            <Dropdown
              ref={dropdownRef}
              buttons={[
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
              setIsVisible={setIsToggledDropdownMenu}
              className={styles.dropdown_menu}
            />
          </>
        }
      >
        <div className={styles.profile}>
          <Avatar firstName={user?.firstname} lastName={user?.lastname} size='large' />
          <div className={styles.profile_bottom}>
            <p className={styles.profile__name}>
              {user?.firstname} {user?.lastname}
            </p>
            <p className={styles.profile__status}>online</p>
          </div>
        </div>
      </SidebarLayout>
      <EditProfile
        isOpened={isEditProfileVisible}
        onClose={() => setIsEditProfileVisible(false)}
        setIsVisible={setIsEditProfileVisible}
      />
    </>
  );
};

export { Settings };
