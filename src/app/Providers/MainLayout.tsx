import { Outlet } from 'react-router-dom';

import { useHandleMessageSocket, useMobileStore } from '~/shared';
import { Sidebar } from '~/widgets';

const MainLayout = () => {
  const { type } = useMobileStore();

  useHandleMessageSocket();

  if (type !== 'desktop') {
    return (
      <div className='layout'>
        <Sidebar />
        <Outlet />
      </div>
    );
  }

  return (
    <div className='layout'>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export { MainLayout };
