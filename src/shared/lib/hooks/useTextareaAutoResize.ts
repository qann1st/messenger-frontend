import { RefObject, useEffect } from 'react';

export const useTextareaAutoResize = (ref: RefObject<HTMLTextAreaElement>, value: string) => {
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const newLines = value.split(/\n/).length - 1;
    const height = 22 * newLines + 50;

    ref.current.style.height = `${height > 94 ? 94 : height}px`;
  }, [value]);
};
