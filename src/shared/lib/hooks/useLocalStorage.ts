import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useLocalStorage<T = unknown>(key: string): [T | undefined, Dispatch<SetStateAction<T | undefined>>];
export function useLocalStorage<T = unknown>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>];

export function useLocalStorage<T = unknown>(key: string, initialValue?: T) {
  const getValue = () => {
    const storage = localStorage.getItem(key);

    if (storage) {
      try {
        return JSON.parse(storage);
      } catch {
        return initialValue;
      }
    }

    return initialValue;
  };

  const [value, setValue] = useState<T>(getValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
