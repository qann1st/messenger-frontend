import { type FC, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAppInit, useThemeStore } from '~/shared';

import { Providers } from './Providers';
import { AppRoutes } from './Providers/AppRoutes';
import './styles';

const App: FC = () => {
  const { fetching } = useAppInit();
  const { theme } = useThemeStore();

  if (fetching) {
    return (
      <div className='wrapper wrapper_background'>
        <span className='loader' />
      </div>
    );
  }

  return (
    <>
      <Suspense
        fallback={
          <div className='wrapper wrapper_background'>
            <span className='loader' />
          </div>
        }
      >
        <Providers>
          <AppRoutes />
          <ToastContainer position='top-center' theme={theme} autoClose={3000} />
        </Providers>
      </Suspense>
    </>
  );
};

export { App };
