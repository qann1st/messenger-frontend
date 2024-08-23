import { lazy } from 'react';

export const Avatar = lazy(() => import('./Avatar').then(({ Avatar }) => ({ default: Avatar })));

export * from './Avatar.types';
