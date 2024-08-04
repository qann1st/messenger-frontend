import { useCallback, useEffect, useRef, useState } from 'react';

type UseLongPressOptions = {
  delay?: number;
  onLongPress: (e: any) => void;
};

export const useLongPress = ({ delay = 500, onLongPress }: UseLongPressOptions) => {
  const [isPressing, setIsPressing] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const startPress = useCallback(
    (e: any) => {
      setIsPressing(true);
      timeoutRef.current = setTimeout(() => {
        onLongPress(e);
        setIsPressing(false);
      }, delay);
    },
    [delay, onLongPress],
  );

  const stopPress = useCallback(() => {
    setIsPressing(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPressing) {
      return;
    }

    const handleMouseUp = (e: any) => {
      stopPress();
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isPressing, stopPress]);

  return {
    onMouseDown: startPress,
    onMouseUp: stopPress,
    onMouseLeave: stopPress,
    onTouchStart: startPress,
    onTouchEnd: stopPress,
    onTouchCancel: stopPress,
  };
};
