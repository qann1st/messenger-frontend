import { lazy } from 'react';

export const MessagesList = lazy(() =>
  import('./MessagesList').then(({ MessagesList }) => ({ default: MessagesList })),
);

export * from './MessagesList.types';
