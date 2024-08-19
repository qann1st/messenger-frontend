import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useShallow } from 'zustand/react/shallow';

import { useMobileStore, useThemeStore, useUserStore } from '~/shared';

export const useAppInit = () => {
  const [fetchUser, fetching, setSocket] = useUserStore(
    useShallow((state) => [state.fetchUser, state.fetching, state.setSocket]),
  );
  const { setType } = useMobileStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newType = window.matchMedia('(max-width: 600px)').matches
        ? 'mobile'
        : window.matchMedia('(max-width: 992px)').matches
          ? 'tablet'
          : 'desktop';

      setType(newType);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.setAttribute('theme', theme);
  }, [theme]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    setSocket(
      io(import.meta.env.VITE_MESSENGER_SOCKET_CHAT, {
        auth: { token: document.cookie.split('=')[1] },
      }),
    );
  }, [token]);

  return {
    fetching,
  };
};
