import { type FC } from 'react';

import { useAppInit } from '~/shared/lib/hooks/useAppInit';

import { Providers } from './Providers';
import { AppRoutes } from './Providers/AppRoutes';
import './styles';

const App: FC = () => {
  const { fetching } = useAppInit();

  if (fetching) {
    return (
      <div className='wrapper wrapper_background'>
        <span className='loader' />
      </div>
    );
  }

  return (
    <>
      <Providers>
        <AppRoutes />
      </Providers>
    </>
  );
};

export { App };
