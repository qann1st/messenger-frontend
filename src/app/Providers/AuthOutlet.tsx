import type { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useUserStore } from '~/shared';

const AuthOutlet: FC = () => {
  const { user } = useUserStore();

  return user ? <Outlet /> : <Navigate to='/sign-in' />;
};

export { AuthOutlet };
