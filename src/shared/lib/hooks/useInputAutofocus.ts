import { type RefObject, useEffect } from 'react';

export const useInputAutofocus = (inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>) => {
  const handleKeyDown = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
