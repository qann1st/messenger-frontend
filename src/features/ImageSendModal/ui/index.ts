import { lazy } from 'react';

export const ImageSendModal = lazy(() =>
  import('./ImageSendModal').then(({ ImageSendModal }) => ({ default: ImageSendModal })),
);
