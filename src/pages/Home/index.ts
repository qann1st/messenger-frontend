import { lazy } from 'react';

export const Home = lazy(() => import('./Home').then(({ Home }) => ({ default: Home })));
