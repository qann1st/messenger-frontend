import { lazy } from 'react';

export const Button = lazy(() => import('./Button').then(({ Button }) => ({ default: Button })));

export * from './Button.types';
