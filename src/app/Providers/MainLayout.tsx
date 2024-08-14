import { Outlet } from 'react-router-dom';

import { useMobileStore } from '~/shared';
import { Sidebar } from '~/widgets';

const MainLayout = () => {
  const { type } = useMobileStore();

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
