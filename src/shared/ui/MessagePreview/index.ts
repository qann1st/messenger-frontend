import { lazy } from 'react';

export const MessagePreview = lazy(() =>
  import('./MessagePreview').then(({ MessagePreview }) => ({ default: MessagePreview })),
);

export * from './MessagePreview.types';
