import { lazy } from 'react';

export const SearchDialogsList = lazy(() =>
  import('./SearchDialogsList').then(({ SearchDialogsList }) => ({ default: SearchDialogsList })),
);
