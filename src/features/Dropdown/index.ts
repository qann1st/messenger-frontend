import { lazy } from 'react';

export const Dropdown = lazy(() => import('./Dropdown').then(({ Dropdown }) => ({ default: Dropdown })));

export * from './Dropdown.types';
