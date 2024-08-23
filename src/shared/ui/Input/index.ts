import { lazy } from 'react';

export const Input = lazy(() => import('./Input').then(({ Input }) => ({ default: Input })));

export * from './Input.types';
