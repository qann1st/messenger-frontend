import { type RefObject, useEffect } from 'react';

import { useMessageStore } from '~/entities';

export const useInputAutofocus = (inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>) => {
  const handleKeyDown = () => {
    const { otherInputFocus } = useMessageStore.getState();
    if (inputRef.current && !otherInputFocus) {
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
