import { useEffect, useRef } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { classNames, useHandleMessageSocket, useMobileStore, useThemeStore } from '~/shared';
import { Sidebar } from '~/widgets';

const MainLayout = () => {
  const { theme } = useThemeStore();
  const { type } = useMobileStore();

  const { dialogId } = useParams();

  useHandleMessageSocket();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    const gradientImage = new Image();
    gradientImage.src = '/assets/gradient.png';

    gradientImage.onload = () => {
      if (ctx) {
        const width = canvas.width;
        const height = canvas.height;

        ctx.drawImage(gradientImage, 0, 0, width, height);
      }
    };
  }, [theme]);

  return (
    <div className='layout'>
      <Sidebar />
      <div className='layout__content'>
        <div
          className={classNames(
            'layout__background',
            `layout__background_${theme}`,
            type !== 'desktop' && dialogId && `layout__background_${type}`,
          )}
        />
        <Outlet />
      </div>
    </div>
  );
};

export { MainLayout };
