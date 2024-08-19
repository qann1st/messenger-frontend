import { RefObject } from 'react';

export const toggleDarkMode = async (
  theme: 'light' | 'dark',
  toggleTheme: () => void,
  ref?: RefObject<HTMLButtonElement>,
) => {
  if (!ref || !ref.current) {
    return;
  }

  const transition = document.startViewTransition(() => {
    toggleTheme();
  });

  const reverse = theme === 'dark';

  document.documentElement.classList.add('no-view-transition');
  document.documentElement.classList.toggle('reverse', reverse);

  const { top, left } = ref.current.getBoundingClientRect();
  const x = left + 22;
  const y = top + 22;
  const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
      },
      {
        duration: 650,
        easing: 'ease-in-out',
        pseudoElement: `::view-transition-${reverse ? 'old' : 'new'}(root)`,
        direction: reverse ? 'reverse' : 'normal',
      },
    );
  });

  transition.finished.finally(() => {
    document.documentElement.classList.remove('no-view-transition', 'reverse');
  });
};
