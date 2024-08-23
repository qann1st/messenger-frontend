import { lazy } from 'react';

export const SignUp = lazy(() => import('./SignUp').then(({ SignUp }) => ({ default: SignUp })));
