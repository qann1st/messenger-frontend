import type { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useUserStore } from '~/shared';

const NonAuthOutlet: FC = () => {
  const { user } = useUserStore();

  return user ? <Navigate to='/' /> : <Outlet />;
};

export { NonAuthOutlet };
