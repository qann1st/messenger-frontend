import { lazy } from 'react';

export const AppRoutes = lazy(() => import('./AppRoutes').then(({ AppRoutes }) => ({ default: AppRoutes })));
export const AuthOutlet = lazy(() => import('./AuthOutlet').then(({ AuthOutlet }) => ({ default: AuthOutlet })));
export const ErrorBoundary = lazy(() =>
  import('./ErrorBoundary').then(({ ErrorBoundary }) => ({ default: ErrorBoundary })),
);
export const MainLayout = lazy(() => import('./MainLayout').then(({ MainLayout }) => ({ default: MainLayout })));
export const NonAuthOutlet = lazy(() =>
  import('./NonAuthOutlet').then(({ NonAuthOutlet }) => ({ default: NonAuthOutlet })),
);
export const Providers = lazy(() => import('./Providers').then(({ Providers }) => ({ default: Providers })));
