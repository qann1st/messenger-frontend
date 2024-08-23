import { useEffect } from 'react';

export const usePopStateCloseModal = (callback: () => void) => {
  useEffect(() => {
    const listener = () => {
      callback();
    };
    window.addEventListener('popstate', listener);
    return () => {
      window.removeEventListener('popstate', listener);
    };
  }, []);
};
