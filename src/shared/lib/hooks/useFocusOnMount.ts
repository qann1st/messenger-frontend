import { RefObject, useEffect } from 'react';

export const useFocusOnMount = (ref: RefObject<HTMLTextAreaElement>) => {
  useEffect(() => {
    ref.current?.focus();
  }, []);
};
