import { lazy } from 'react';

export const ImageModal = lazy(() => import('./ImageModal').then(({ ImageModal }) => ({ default: ImageModal })));
