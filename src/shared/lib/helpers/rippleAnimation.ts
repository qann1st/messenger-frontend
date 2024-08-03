import type { MouseEvent, RefObject } from 'react';

export const rippleAnimation = ({
  className,
  e,
  ref,
  size,
  duration = 500,
}: {
  e: MouseEvent<HTMLElement>;
  className: string;
  ref: RefObject<HTMLElement>;
  size: number;
  duration?: number;
}) => {
  const wave = document.createElement('span');
  wave.classList.add(className);

  if (ref.current) {
    const { x, y } = ref.current.getBoundingClientRect();
    wave.style.left = `${e.pageX - x - size}px`;
    wave.style.top = `${e.pageY - y - size}px`;
    ref.current.appendChild(wave);
  }
  setTimeout(() => {
    wave.remove();
  }, duration);
};
