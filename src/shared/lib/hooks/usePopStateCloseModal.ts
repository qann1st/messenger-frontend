import { useEffect } from 'react';

export const usePopStateCloseModal = (callback: (e?: PopStateEvent) => void) => {
  useEffect(() => {
    window.addEventListener('popstate', callback);
    return () => {
      window.removeEventListener('popstate', callback);
    };
  }, []);
};
