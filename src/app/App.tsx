import { type FC, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';

import { Chat, Home, SignIn, SignInApprove, SignUp, SignUpApprove } from '~/pages';
import { useThemeStore, useUserStore } from '~/shared';

import { AuthOutlet, NonAuthOutlet, Providers } from './Providers';
import { MainLayout } from './Providers/MainLayout';
import './styles';

const App: FC = () => {
  const { fetchUser, fetching, setSocket } = useUserStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    fetchUser();
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

  if (fetching) {
    return (
      <div className='wrapper wrapper_background'>
        <span className='loader' />
      </div>
    );
  }

  return (
    <Providers>
      <Routes>
        <Route element={<AuthOutlet />}>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path=':dialogId' element={<Chat />} />
          </Route>
        </Route>
        <Route element={<NonAuthOutlet />}>
          <Route path='sign-in'>
            <Route index element={<SignIn />} />
            <Route path='approve' element={<SignInApprove />} />
          </Route>
          <Route path='sign-up'>
            <Route index element={<SignUp />} />
            <Route path='approve' element={<SignUpApprove />} />
          </Route>
        </Route>
        <Route path='*' element={<h1>404</h1>} />
      </Routes>
    </Providers>
  );
};

export { App };
