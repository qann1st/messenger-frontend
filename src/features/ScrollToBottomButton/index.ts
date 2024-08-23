import { lazy } from 'react';

export const ScrollToBottomButton = lazy(() =>
  import('./ScrollToBottomButton').then(({ ScrollToBottomButton }) => ({ default: ScrollToBottomButton })),
);

export * from './ScrollToBottomButton.types';
