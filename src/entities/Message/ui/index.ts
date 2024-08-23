import { lazy } from 'react';

export const Message = lazy(() => import('./Message').then(({ Message }) => ({ default: Message })));

export * from './Message.types';
