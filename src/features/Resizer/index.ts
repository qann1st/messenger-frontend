import { lazy } from 'react';

export const Resizer = lazy(() => import('./Resizer').then(({ Resizer }) => ({ default: Resizer })));
