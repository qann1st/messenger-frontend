import { RefObject, useEffect } from 'react';

import { useLatest } from './useLatest';

export const useOutsideClick = (elementRef: RefObject<HTMLElement>, handler: () => void, attached = true) => {
  const latestHandler = useLatest(handler);

  useEffect(() => {
    if (!attached) {
      return;
    }

    const handleClick = (e: globalThis.MouseEvent) => {
      if (!elementRef.current) {
        return;
      }

      if (!elementRef.current.contains(e.target as Node)) {
        latestHandler.current();
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [elementRef, latestHandler, attached]);
};
