import { lazy } from 'react';

export const SidebarLayout = lazy(() =>
  import('./SidebarLayout').then(({ SidebarLayout }) => ({ default: SidebarLayout })),
);

export * from './SidebarLayout.types';
