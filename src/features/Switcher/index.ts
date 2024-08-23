import { lazy } from 'react';

export const Switcher = lazy(() => import('./Switcher').then(({ Switcher }) => ({ default: Switcher })));

export * from './Switcher.types';
