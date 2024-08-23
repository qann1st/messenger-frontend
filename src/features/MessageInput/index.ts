import { lazy } from 'react';

export const MessageInput = lazy(() =>
  import('./MessageInput').then(({ MessageInput }) => ({ default: MessageInput })),
);

export * from './model';
