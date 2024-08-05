import { useCallback, useEffect, useRef } from 'react';

export const useTimeout = (callback: (...args: any[]) => void, delay: number) => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const set = useCallback(
    (e?: MouseEvent | TouchEvent) => {
      timeoutRef.current = setTimeout(() => callbackRef.current(e), delay);
    },
    [delay],
  );

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  const reset = useCallback(
    (e: MouseEvent | TouchEvent) => {
      clear();
      set(e);
    },
    [clear, set],
  );

  return { reset, clear };
};
