import { Outlet, useLocation, useParams } from 'react-router-dom';

import { useHandleMessageSocket, useMobileStore } from '~/shared';
import { Sidebar } from '~/widgets';

const MainLayout = () => {
  const { type } = useMobileStore();
  const { dialogId } = useParams();
  const { pathname } = useLocation();
  const dialogPathname = `/${dialogId}`;

  useHandleMessageSocket();

  if (type === 'mobile') {
    return (
      <div className='layout'>
        {pathname !== dialogPathname && <Sidebar />}
        {pathname === dialogPathname && <Outlet />}
      </div>
    );
  }

  if (type === 'tablet') {
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
