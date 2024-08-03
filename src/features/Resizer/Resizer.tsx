import { type FC, useCallback, useEffect, useState } from 'react';

import { useThemeStore } from '~/shared';

import styles from './Resizer.module.css';

import type { TResizerProps } from './Resizer.types';

const Resizer: FC<TResizerProps> = ({ elementRef }) => {
  const [isResizing, setIsResizing] = useState(false);
  const { theme } = useThemeStore();

  const resizeElement = useCallback(
    (e: MouseEvent) => {
      if (elementRef.current && isResizing) {
        const sidebarWidth = `${e.pageX}px`;

        elementRef.current.style.width = sidebarWidth;
        localStorage.setItem('sidebarWidth', sidebarWidth);
      }
    },
    [isResizing, elementRef],
  );

  useEffect(() => {
    const stopResizing = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', resizeElement);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', resizeElement);
      window.removeEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resizeElement);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resizeElement]);

  useEffect(() => {
    const sidebarWidth = localStorage.getItem('sidebarWidth') ?? '400px';

    if (elementRef.current) {
      elementRef.current.style.width = sidebarWidth;
    }
  }, []);

  return (
    <div onMouseDown={() => setIsResizing(true)} className={styles.root}>
      <hr color={theme === 'dark' ? '#212425' : '#ffffff'} />
    </div>
  );
};

export { Resizer };
