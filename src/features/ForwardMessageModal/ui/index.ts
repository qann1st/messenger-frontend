import { lazy } from 'react';

export const ForwardMessageModal = lazy(() => import('./ForwardMessageModal').then(({ ForwardMessageModal }) => ({ default: ForwardMessageModal })));
