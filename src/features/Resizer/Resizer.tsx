import { type FC, memo, useCallback, useEffect, useState } from 'react';

import { classNames, useLocalStorage, useMobileStore } from '~/shared';

import styles from './Resizer.module.css';

import type { TResizerProps } from './Resizer.types';

const Resizer: FC<TResizerProps> = memo(({ elementRef }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useLocalStorage('sidebarWidth', '400px');

  const { type } = useMobileStore();

  const resizeElement = useCallback(
    (e: MouseEvent) => {
      if (elementRef.current && isResizing) {
        const sidebarWidth = `${e.pageX}px`;

        elementRef.current.style.width = sidebarWidth;
        setWidth(sidebarWidth);
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
    const sidebarWidth = width;

    if (elementRef.current) {
      elementRef.current.style.width = sidebarWidth;
    }
  }, []);

  useEffect(() => {
    if (type === 'desktop') {
      if (elementRef.current) {
        elementRef.current.style.width = width;
        elementRef.current.style.maxWidth = '33vw';
      }
    }

    if (type === 'mobile') {
      if (elementRef.current) {
        elementRef.current.style.width = '100vw';
        elementRef.current.style.maxWidth = '100%';
      }
    }

    if (type === 'tablet') {
      if (elementRef.current) {
        elementRef.current.style.width = '50vw';
        elementRef.current.style.maxWidth = '100%';
      }
    }
  }, [type]);

  return (
    <div
      onMouseDown={() => setIsResizing(true)}
      className={classNames(styles.root, type !== 'desktop' && styles.root_mobile)}
    />
  );
});

export { Resizer };
