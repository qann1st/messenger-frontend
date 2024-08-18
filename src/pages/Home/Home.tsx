import type { FC } from 'react';

import { classNames, useThemeStore } from '~/shared';

const Home: FC = () => {
  const { theme } = useThemeStore();

  return (
    <main
      className={classNames(
        'wrapper',
        theme === 'light' && 'wrapper_background_chat',
        `wrapper_background_chat_${theme}`,
      )}
    />
  );
};

export { Home };
