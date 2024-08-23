import { lazy } from 'react';

export const SignIn = lazy(() => import('./SignIn').then(({ SignIn }) => ({ default: SignIn })));
