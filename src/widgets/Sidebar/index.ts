import { lazy } from 'react';

export const Sidebar = lazy(() => import('./Sidebar').then(({ Sidebar }) => ({ default: Sidebar })));
