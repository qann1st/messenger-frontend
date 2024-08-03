import { useRef } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

import { useThemeStore } from '~/shared';

import styles from './ThemeButton.module.css';

const ThemeButton = () => {
  const { theme, toggleTheme } = useThemeStore();
  const ref = useRef<HTMLButtonElement>(null);

  const toggleDarkMode = async () => {
    if (!ref.current) {
      return;
    }

    const transition = document.startViewTransition(() => {
      toggleTheme();
    });

    const reverse = theme === 'light';

    document.documentElement.classList.add('no-view-transition');
    document.documentElement.classList.toggle('reverse', reverse);

    const { top, left } = ref.current.getBoundingClientRect();
    const x = left + 11;
    const y = top + 11;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
        },
        {
          duration: 500,
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

  return (
    <button ref={ref} onClick={toggleDarkMode} className={styles.icon_button}>
      {theme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
    </button>
  );
};

export { ThemeButton };
