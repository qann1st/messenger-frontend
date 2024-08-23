import { lazy } from 'react';

export const Settings = lazy(() => import('./Settings').then(({ Settings }) => ({ default: Settings })));

export * from './Settings.types';
