import { lazy } from 'react';

export const MessagesByDateList = lazy(() =>
  import('./MessagesByDateList').then(({ MessagesByDateList }) => ({ default: MessagesByDateList })),
);
