import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { useMobileStore, useThemeStore, useUserStore } from '~/shared/model';

export const useAppInit = () => {
  const { fetchUser, fetching, setSocket } = useUserStore();
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

  useEffect(() => {
    setSocket(
      io(import.meta.env.VITE_MESSENGER_SOCKET_CHAT, {
        auth: { token: localStorage.getItem('token') },
      }),
    );
  }, [localStorage.getItem('token')]);

  return {
    fetching,
  };
};
