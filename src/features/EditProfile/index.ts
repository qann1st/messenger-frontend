import { lazy } from 'react';

export const EditProfile = lazy(() => import('./EditProfile').then(({ EditProfile }) => ({ default: EditProfile })));

export * from './EditProfile.types';
