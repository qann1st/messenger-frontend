import { lazy } from 'react';

export const Auth = lazy(() => import('./Auth').then(({ Auth }) => ({ default: Auth })));

export * from './Auth.types';
