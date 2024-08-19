import { RefObject, forwardRef } from 'react';

import { classNames } from '~/shared';

import styles from './Dropdown.module.css';

import { Switcher } from '../Switcher';
import { TDropdownProps } from './Dropdown.types';

const Dropdown = forwardRef<HTMLDivElement, TDropdownProps>(({ buttons, isToggled, className }, ref) => (
  <div ref={ref} className={classNames(styles.dropdownMenu, isToggled && styles.dropdownMenu_visible, className)}>
    {buttons.map(
      ({ icon: Icon, show = true, ...button }) =>
        show && (
          <div
            key={button.text}
            className={classNames(styles.dropdown_button, button.isDelete && styles.dropdown_button_delete)}
            onClick={() => button.onClick?.(ref as RefObject<HTMLButtonElement>)}
          >
            <div className={styles.icon_text}>
              <Icon size={20} /> {button.text}
            </div>
            {button.checkbox && isToggled && <Switcher isActive={button.isActive ?? false} />}
          </div>
        ),
    )}
  </div>
));

export { Dropdown };
