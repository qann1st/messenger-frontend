import { lazy } from 'react';

export const SearchInput = lazy(() => import('./SearchInput').then(({ SearchInput }) => ({ default: SearchInput })));

export * from './SearchInput.types';
