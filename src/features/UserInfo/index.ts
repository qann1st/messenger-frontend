import { lazy } from 'react';

export const UserInfo = lazy(() => import('./UserInfo').then(({ UserInfo }) => ({ default: UserInfo })));

export * from './UserInfo.types';
