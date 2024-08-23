import { lazy } from 'react';

export const ContextMenu = lazy(() => import('./ContextMenu').then(({ ContextMenu }) => ({ default: ContextMenu })));

export * from './ContextMenu.types';
