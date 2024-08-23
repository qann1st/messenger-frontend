import { lazy } from 'react';

export const DialogsList = lazy(() => import('./DialogsList').then(({ DialogsList }) => ({ default: DialogsList })));
