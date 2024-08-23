import { lazy } from 'react';

export const Chat = lazy(() => import('./Chat').then(({ Chat }) => ({ default: Chat })));
