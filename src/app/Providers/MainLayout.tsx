import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useHandleMessageSocket, useMobileStore } from '~/shared';
import { Sidebar } from '~/widgets';

const MainLayout = () => {
  const { type } = useMobileStore();

  useHandleMessageSocket();

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

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
