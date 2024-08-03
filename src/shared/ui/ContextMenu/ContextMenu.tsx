import { forwardRef } from 'react';

import { classNames } from '~/shared';

import styles from './ContextMenu.module.css';

import { TContextMenuProps } from './ContextMenu.types';

const ContextMenu = forwardRef<HTMLDivElement, TContextMenuProps>(({ isToggled, posX, posY, buttons }, ref) => (
  <div
    style={{ top: posY, left: posX }}
    ref={ref}
    className={classNames(styles.contextMenu, isToggled && styles.contextMenu_visible)}
  >
    {buttons.map(
      ({ icon: Icon, show = true, ...button }) =>
        show && (
          <div
            key={button.text}
            className={classNames(styles.context_button, button.isDelete && styles.context_button_delete)}
            onClick={button.onClick}
          >
            <Icon size={20} /> {button.text}
          </div>
        ),
    )}
  </div>
));

export { ContextMenu };
