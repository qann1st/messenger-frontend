import { Outlet } from 'react-router-dom';

import { useHandleMessageSocket } from '~/shared';
import { Sidebar } from '~/widgets';

const MainLayout = () => {
  useHandleMessageSocket();

  return (
    <div className='layout'>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export { MainLayout };
